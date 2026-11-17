using System;

namespace NzbDrone.Core.Update
{
    // Midgar: where an update is, so the page can show a progress bar from the
    // download until the new version is running.
    public class UpdateProgressInfo
    {
        // "", "check", "download", "verify", "extract", "restart" or "failed".
        public string Phase { get; set; } = string.Empty;
        public string Version { get; set; }
        public long Done { get; set; }
        public long Total { get; set; }
        public string Message { get; set; }
        public DateTime Updated { get; set; }
    }

    public static class UpdateProgress
    {
        private static readonly object Gate = new object();
        private static UpdateProgressInfo _current = new UpdateProgressInfo();

        public static void Set(string phase, string version, long done = 0, long total = 0, string message = null)
        {
            lock (Gate)
            {
                _current = new UpdateProgressInfo
                {
                    Phase = phase,
                    Version = version,
                    Done = done,
                    Total = total,
                    Message = message,
                    Updated = DateTime.UtcNow
                };
            }
        }

        public static void Clear()
        {
            Set(string.Empty, null);
        }

        public static UpdateProgressInfo Get()
        {
            lock (Gate)
            {
                return _current;
            }
        }
    }
}
