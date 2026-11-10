using System;
using System.IO;
using System.Linq;
using System.Reflection;

namespace NzbDrone.Common.EnvironmentInfo
{
    public static class BuildInfo
    {
        static BuildInfo()
        {
            var assembly = Assembly.GetExecutingAssembly();

            Version = assembly.GetName().Version;

            var attributes = assembly.GetCustomAttributes(true);

            Branch = "unknow";

            var config = attributes.OfType<AssemblyConfigurationAttribute>().FirstOrDefault();
            if (config != null)
            {
                Branch = config.Configuration;
            }

            Release = $"{Version}-{Branch}";

            AppVersion = Version;
            var midgarVersion = attributes.OfType<AssemblyMetadataAttribute>().FirstOrDefault(a => a.Key == "MidgarVersion");
            if (midgarVersion != null && System.Version.TryParse(midgarVersion.Value, out var parsed))
            {
                AppVersion = parsed;
            }
        }

        public static string AppName { get; } = "Midgar";

        public static Version Version { get; }

        // Midgar's own version (1.1, 1.2, ...). Version above keeps Sonarr's numbering for compatibility.
        public static Version AppVersion { get; }
        public static string Branch { get; }
        public static string Release { get; }

        public static DateTime BuildDateTime
        {
            get
            {
                var fileLocation = Assembly.GetCallingAssembly().Location;
                return new FileInfo(fileLocation).LastWriteTimeUtc;
            }
        }

        public static bool IsDebug
        {
            get
            {
#if DEBUG
                return true;
#else
                return false;
#endif
            }
        }
    }
}
