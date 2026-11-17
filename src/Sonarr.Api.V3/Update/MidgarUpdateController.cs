using System;
using Microsoft.AspNetCore.Mvc;
using NzbDrone.Common;
using NzbDrone.Common.EnvironmentInfo;
using NzbDrone.Common.Http;
using NzbDrone.Core.Update;
using Sonarr.Http;

namespace Sonarr.Api.V3.Update
{
    // Midgar: lets the Updates page ask the Windows desktop app to install the newest release,
    // and hands out the newest package so the page never links anywhere else.
    [V3ApiController("midgarupdate")]
    public class MidgarUpdateController : Controller
    {
        private readonly IUpdatePackageProvider _updatePackageProvider;
        private readonly IHttpClient _httpClient;

        public MidgarUpdateController(IUpdatePackageProvider updatePackageProvider, IHttpClient httpClient)
        {
            _updatePackageProvider = updatePackageProvider;
            _httpClient = httpClient;
        }

        [HttpPost("install")]
        [Produces("application/json")]
        public MidgarInstallResource Install()
        {
            return new MidgarInstallResource { Started = MidgarUpdateSignal.TryRequest() };
        }

        // The newest package for this system (the .spk on a NAS, the installer on Windows).
        [HttpGet("package")]
        public IActionResult Package()
        {
            var latest = _updatePackageProvider.GetLatestUpdate("main", BuildInfo.AppVersion);

            if (latest == null || string.IsNullOrWhiteSpace(latest.FileName) || string.IsNullOrWhiteSpace(latest.Url))
            {
                return NotFound(new { message = "There's no newer version to download." });
            }

            try
            {
                var request = new HttpRequest(latest.Url)
                {
                    LogHttpError = false,
                    RequestTimeout = TimeSpan.FromMinutes(10)
                };

                var response = _httpClient.Get(request);

                return File(response.ResponseData, "application/octet-stream", latest.FileName);
            }
            catch (Exception)
            {
                return StatusCode(502, new { message = "Couldn't download the update. Try again later." });
            }
        }
    }

    public class MidgarInstallResource
    {
        public bool Started { get; set; }
    }
}
