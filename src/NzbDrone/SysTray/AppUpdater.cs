using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using NLog;
using NzbDrone.Common.EnvironmentInfo;
using NzbDrone.Common.Instrumentation;

namespace NzbDrone.SysTray
{
    public class AvailableUpdate
    {
        public Version Version { get; set; }
        public string InstallerUrl { get; set; }
        public string PageUrl { get; set; }
    }

    // Midgar: updates come from the GitHub releases of AnimaTheAeon/Midgar.
    // Sonarr's own updater is off because it would install Sonarr over Midgar.
    public static class AppUpdater
    {
        public const string Repo = "AnimaTheAeon/Midgar";

        private static readonly Logger Logger = NzbDroneLogger.GetLogger(typeof(AppUpdater));
        private static readonly HttpClient Http = CreateClient();

        public static async Task<AvailableUpdate> CheckAsync()
        {
            try
            {
                var json = await Http.GetStringAsync($"https://api.github.com/repos/{Repo}/releases/latest");
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                var tag = root.GetProperty("tag_name").GetString() ?? string.Empty;

                if (!Version.TryParse(tag.TrimStart('v', 'V'), out var latest) || Full(latest) <= Full(BuildInfo.AppVersion))
                {
                    return null;
                }

                var installer = root.GetProperty("assets").EnumerateArray()
                    .Select(a => a.GetProperty("browser_download_url").GetString())
                    .FirstOrDefault(u => u != null && u.EndsWith("-win-x64-setup.exe", StringComparison.OrdinalIgnoreCase));

                if (installer == null)
                {
                    return null;
                }

                return new AvailableUpdate
                {
                    Version = latest,
                    InstallerUrl = installer,
                    PageUrl = root.GetProperty("html_url").GetString()
                };
            }
            catch (Exception ex)
            {
                Logger.Debug(ex, "Update check failed");
                return null;
            }
        }

        // Downloads the installer and starts it quietly. The installer closes Midgar,
        // replaces the files and starts Midgar again.
        public static async Task StartInstallAsync(AvailableUpdate update)
        {
            var path = Path.Combine(Path.GetTempPath(), $"Midgar-{update.Version}-setup.exe");

            using (var response = await Http.GetAsync(update.InstallerUrl, HttpCompletionOption.ResponseHeadersRead))
            {
                response.EnsureSuccessStatusCode();

                await using var file = File.Create(path);
                await response.Content.CopyToAsync(file);
            }

            Logger.Info("Installing Midgar {0}", update.Version);

            Process.Start(new ProcessStartInfo(path, "/SILENT /SUPPRESSMSGBOXES /NORESTART /CLOSEAPPLICATIONS")
            {
                UseShellExecute = true
            });
        }

        // 1.1 and 1.1.0 are the same version.
        private static Version Full(Version v)
        {
            return new Version(v.Major, v.Minor, Math.Max(v.Build, 0), Math.Max(v.Revision, 0));
        }

        private static HttpClient CreateClient()
        {
            var client = new HttpClient { Timeout = TimeSpan.FromMinutes(10) };
            client.DefaultRequestHeaders.UserAgent.ParseAdd($"Midgar/{BuildInfo.AppVersion}");
            client.DefaultRequestHeaders.Accept.ParseAdd("application/vnd.github+json");

            return client;
        }
    }
}
