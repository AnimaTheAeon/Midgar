using System;
using System.Threading;

namespace NzbDrone.Common
{
    // Midgar: the Windows desktop app listens on this named event and installs the
    // newest release when it fires. The Updates page fires it through the API.
    public static class MidgarUpdateSignal
    {
        public const string Name = @"Local\Midgar.InstallUpdate";

        public static bool TryRequest()
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
                // No desktop app is listening.
            }

            return false;
        }
    }
}
