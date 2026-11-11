using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace NzbDrone.Common.Disk
{
    // Midgar: lets the folder browser on Windows see network folders (a NAS).
    // "\\server\" lists that server's shared folders, and the drive list also
    // shows the network folders this Windows user has mapped or opened before.
    public static class WindowsNetwork
    {
        private const int MaxKnownShares = 30;

        private static readonly Regex ServerRegex = new Regex(@"^\\\\[^\\/]+\\$", RegexOptions.Compiled);
        private static readonly Regex ShareRootRegex = new Regex(@"^(\\\\[^\\/]+\\)[^\\/]+\\?$", RegexOptions.Compiled);

        // True for "\\server\" (a server with no shared folder picked yet).
        public static bool IsServerPath(string path)
        {
            return path != null && ServerRegex.IsMatch(path);
        }

        // "\\server\share\" gives "\\server\"; anything else gives null.
        public static string GetServerOfShareRoot(string path)
        {
            var match = ShareRootRegex.Match(path ?? string.Empty);

            return match.Success ? match.Groups[1].Value : null;
        }

        // The shared folders of "\\server\", as "\\server\share\" paths.
        public static List<string> GetShares(string serverPath)
        {
            var shares = new List<string>();

            if (!OperatingSystem.IsWindows() || !IsServerPath(serverPath))
            {
                return shares;
            }

            var server = serverPath.TrimEnd('\\');
            var resume = 0;
            var status = NetShareEnum(server, 1, out var buffer, -1, out var entriesRead, out _, ref resume);

            if (status != 0 || buffer == IntPtr.Zero)
            {
                return shares;
            }

            try
            {
                var size = Marshal.SizeOf<ShareInfo1>();

                for (var i = 0; i < entriesRead; i++)
                {
                    var info = Marshal.PtrToStructure<ShareInfo1>(IntPtr.Add(buffer, i * size));
                    var name = Marshal.PtrToStringUni(info.Name);

                    // Type 0 is a disk share; names ending in $ are hidden admin shares.
                    if (info.Type == 0 && !string.IsNullOrWhiteSpace(name) && !name.EndsWith("$"))
                    {
                        shares.Add(server + "\\" + name + "\\");
                    }
                }
            }
            finally
            {
                NetApiBufferFree(buffer);
            }

            shares.Sort(StringComparer.OrdinalIgnoreCase);

            return shares;
        }

        // Network folders this Windows user has mapped to a drive letter or opened in
        // File Explorer, that answer right now. Returned as "\\server\share\" paths.
        public static List<string> GetKnownShares()
        {
            var known = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            if (!OperatingSystem.IsWindows())
            {
                return known.ToList();
            }

            try
            {
                // Mapped drives, which an app started as administrator can't see as letters.
                using (var network = Registry.CurrentUser.OpenSubKey("Network"))
                {
                    if (network != null)
                    {
                        foreach (var letter in network.GetSubKeyNames())
                        {
                            using var drive = network.OpenSubKey(letter);
                            var remote = drive?.GetValue("RemotePath") as string;

                            if (!string.IsNullOrWhiteSpace(remote) && remote.StartsWith(@"\\"))
                            {
                                known.Add(remote.TrimEnd('\\') + "\\");
                            }
                        }
                    }
                }

                // Folders opened in File Explorer are remembered as "##server#share".
                using (var mountPoints = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\MountPoints2"))
                {
                    if (mountPoints != null)
                    {
                        foreach (var name in mountPoints.GetSubKeyNames())
                        {
                            if (name.StartsWith("##") && name.IndexOf('#', 2) > 2)
                            {
                                known.Add(name.Replace('#', '\\').TrimEnd('\\') + "\\");
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                // The registry couldn't be read; show what was found so far.
            }

            var candidates = known.Where(p => GetServerOfShareRoot(p) != null)
                                  .OrderBy(p => p, StringComparer.OrdinalIgnoreCase)
                                  .Take(MaxKnownShares)
                                  .ToList();

            // A server that is switched off can take a long time to answer, so each
            // folder gets a moment to show up and is left out otherwise.
            var checks = candidates.Select(p => Task.Run(() => Directory.Exists(p))).ToArray();

            try
            {
                Task.WaitAll(checks, TimeSpan.FromMilliseconds(1500));
            }
            catch (AggregateException)
            {
                // A failed check counts as not there.
            }

            return candidates.Where((p, i) => checks[i].Status == TaskStatus.RanToCompletion && checks[i].Result).ToList();
        }

        [DllImport("Netapi32.dll", CharSet = CharSet.Unicode)]
        private static extern int NetShareEnum(string serverName, int level, out IntPtr buffer, int preferredMaxLength, out int entriesRead, out int totalEntries, ref int resumeHandle);

        [DllImport("Netapi32.dll")]
        private static extern int NetApiBufferFree(IntPtr buffer);

        [StructLayout(LayoutKind.Sequential)]
        private struct ShareInfo1
        {
            public IntPtr Name;
            public uint Type;
            public IntPtr Remark;
        }
    }
}
