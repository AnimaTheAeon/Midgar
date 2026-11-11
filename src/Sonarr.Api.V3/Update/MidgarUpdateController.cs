using Microsoft.AspNetCore.Mvc;
using NzbDrone.Common;
using Sonarr.Http;

namespace Sonarr.Api.V3.Update
{
    // Midgar: lets the Updates page ask the Windows desktop app to install the newest release.
    [V3ApiController("midgarupdate")]
    public class MidgarUpdateController : Controller
    {
        [HttpPost("install")]
        [Produces("application/json")]
        public MidgarInstallResource Install()
        {
            return new MidgarInstallResource { Started = MidgarUpdateSignal.TryRequest() };
        }
    }

    public class MidgarInstallResource
    {
        public bool Started { get; set; }
    }
}
