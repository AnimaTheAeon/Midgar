using NzbDrone.Core.Messaging.Commands;

namespace NzbDrone.Core.Update.Commands
{
    public class ApplicationUpdateCommand : Command
    {
        public bool InstallMajorUpdate { get; set; }
        public override bool SendUpdatesToClient => true;
        // Midgar: an update starts right away instead of waiting for every other
        // task to finish (a series refresh or RSS sync can take many minutes, with
        // the page stuck at "Starting the download"). Other tasks just stop when
        // Midgar restarts into the new version. Only one update runs at a time.
        public override bool IsTypeExclusive => true;
    }
}
