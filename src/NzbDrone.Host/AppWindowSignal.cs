using System;
using System.Threading;

namespace NzbDrone.Host
{
    // Midgar: the Windows desktop app listens on this named event and brings its
    // window to the front when it fires. Anything that would normally open the web UI
    // in a browser (startup, a second launch) fires it instead.
    public static class AppWindowSignal
    {
        public const string Name = @"Local\Midgar.ShowWindow";

        public static bool TryShow()
        {
            if (!OperatingSystem.IsWindows())
            {
                return false;
            }

            try
            {
                if (EventWaitHandle.TryOpenExisting(Name, out var handle))
                {
                    using (handle)
                    {
                        handle.Set();
                    }

                    return true;
                }
            }
            catch (Exception)
            {
                // Fall back to the browser.
            }

            return false;
        }
    }
}
