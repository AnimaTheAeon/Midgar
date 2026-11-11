using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using NLog;
using NzbDrone.Common.Cache;
using NzbDrone.Common.EnvironmentInfo;
using NzbDrone.Common.Http;

namespace NzbDrone.Core.Update
{
    public interface IUpdatePackageProvider
    {
        UpdatePackage GetLatestUpdate(string branch, Version currentVersion);
        List<UpdatePackage> GetRecentUpdates(string branch, Version currentVersion, Version previousVersion = null);
    }

    // Midgar: versions are the GitHub releases of AnimaTheAeon/Midgar. Sonarr's own
    // update server is never asked, since it only knows about Sonarr.
    public class UpdatePackageProvider : IUpdatePackageProvider
    {
        private const string ReleasesUrl = "https://api.github.com/repos/AnimaTheAeon/Midgar/releases?per_page=10";

        private readonly IHttpClient _httpClient;
        private readonly ICached<List<UpdatePackage>> _cache;
        private readonly Logger _logger;

        public UpdatePackageProvider(IHttpClient httpClient, ICacheManager cacheManager, Logger logger)
        {
            _httpClient = httpClient;
            _cache = cacheManager.GetCache<List<UpdatePackage>>(GetType());
            _logger = logger;
        }

        public UpdatePackage GetLatestUpdate(string branch, Version currentVersion)
        {
            var latest = GetRecentUpdates(branch, currentVersion).OrderByDescending(u => u.Version).FirstOrDefault();

            if (latest == null || Normalize(latest.Version) <= Normalize(BuildInfo.AppVersion))
            {
                return null;
            }

            return latest;
        }

        public List<UpdatePackage> GetRecentUpdates(string branch, Version currentVersion, Version previousVersion = null)
        {
            try
            {
                return _cache.Get("releases", FetchReleases, TimeSpan.FromHours(1));
            }
            catch (Exception ex)
            {
                _logger.Debug(ex, "Couldn't get the list of Midgar releases");

                return new List<UpdatePackage>();
            }
        }

        // 1.4 and 1.4.0 are the same version.
        private static Version Normalize(Version version)
        {
            return new Version(version.Major, version.Minor, Math.Max(version.Build, 0), Math.Max(version.Revision, 0));
        }

        private List<UpdatePackage> FetchReleases()
        {
            var request = new HttpRequest(ReleasesUrl, HttpAccept.Json);
            request.LogHttpError = false;

            var response = _httpClient.Get(request);
            var suffix = OsInfo.IsWindows ? "-win-x64-setup.exe" : ".spk";
            var packages = new List<UpdatePackage>();

            foreach (var release in JArray.Parse(response.Content))
            {
                if (release.Value<bool?>("draft") == true || release.Value<bool?>("prerelease") == true)
                {
                    continue;
                }

                var tag = release.Value<string>("tag_name") ?? string.Empty;

                if (!Version.TryParse(tag.TrimStart('v', 'V'), out var version))
                {
                    continue;
                }

                var package = new UpdatePackage
                {
                    Version = version,
                    ReleaseDate = release.Value<DateTime?>("published_at") ?? DateTime.UtcNow,
                    Branch = "main",
                    Url = release.Value<string>("html_url"),
                    Changes = ParseChanges(release.Value<string>("body"))
                };

                var assets = release["assets"] as JArray;

                if (assets != null)
                {
                    foreach (var asset in assets)
                    {
                        var name = asset.Value<string>("name") ?? string.Empty;

                        if (name.EndsWith(suffix, StringComparison.OrdinalIgnoreCase))
                        {
                            package.FileName = name;
                            package.Url = asset.Value<string>("browser_download_url");
                            package.Hash = (asset.Value<string>("digest") ?? string.Empty).Replace("sha256:", string.Empty);
                        }
                    }
                }

                packages.Add(package);
            }

            return packages;
        }

        // Release notes are a bullet list; lines starting with "Fixed" go under Fixed.
        private static UpdateChanges ParseChanges(string body)
        {
            var changes = new UpdateChanges();

            foreach (var raw in (body ?? string.Empty).Split('\n'))
            {
                var line = raw.Trim();

                if (!line.StartsWith("- ") && !line.StartsWith("* "))
                {
                    continue;
                }

                var text = line.Substring(2).Trim();

                if (text.Length == 0 || text.Contains("Full Changelog"))
                {
                    continue;
                }

                if (text.StartsWith("Fixed", StringComparison.OrdinalIgnoreCase))
                {
                    changes.Fixed.Add(text);
                }
                else
                {
                    changes.New.Add(text);
                }
            }

            return changes;
        }
    }
}
