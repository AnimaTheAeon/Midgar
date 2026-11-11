using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
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

        // SHA-256 of the installer as published by GitHub; null if it wasn't given.
        public string Sha256 { get; set; }
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

                var asset = root.GetProperty("assets").EnumerateArray()
                    .FirstOrDefault(a => (a.GetProperty("browser_download_url").GetString() ?? string.Empty).EndsWith("-win-x64-setup.exe", StringComparison.OrdinalIgnoreCase));

                if (asset.ValueKind != JsonValueKind.Object)
                {
                    return null;
                }

                var installer = asset.GetProperty("browser_download_url").GetString();
                string sha256 = null;

                if (asset.TryGetProperty("digest", out var digest) && digest.ValueKind == JsonValueKind.String)
                {
                    var value = digest.GetString() ?? string.Empty;

                    if (value.StartsWith("sha256:", StringComparison.OrdinalIgnoreCase))
                    {
                        sha256 = value.Substring("sha256:".Length);
                    }
                }

                return new AvailableUpdate
                {
                    Version = latest,
                    InstallerUrl = installer,
                    Sha256 = sha256,
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

            // Only run the installer if it is the exact file GitHub published.
            if (update.Sha256 != null)
            {
                string actual;

                await using (var downloaded = File.OpenRead(path))
                {
                    using var sha = SHA256.Create();
                    actual = Convert.ToHexString(await sha.ComputeHashAsync(downloaded));
                }

                if (!string.Equals(actual, update.Sha256, StringComparison.OrdinalIgnoreCase))
                {
                    File.Delete(path);
                    throw new InvalidDataException("The downloaded installer didn't match its published checksum.");
                }
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
