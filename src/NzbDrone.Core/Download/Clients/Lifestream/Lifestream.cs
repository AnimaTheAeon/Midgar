using NLog;
using NzbDrone.Common.Disk;
using NzbDrone.Common.Http;
using NzbDrone.Core.Blocklisting;
using NzbDrone.Core.Configuration;
using NzbDrone.Core.Download.Clients.Transmission;
using NzbDrone.Core.Localization;
using NzbDrone.Core.MediaFiles.TorrentInfo;
using NzbDrone.Core.RemotePathMappings;

namespace NzbDrone.Core.Download.Clients.Lifestream
{
    // Midgar: Lifestream (AnimaTheAeon/Lifestream) speaks Transmission's remote-control
    // protocol on port 9091, so it gets its own entry that behaves like Transmission.
    public class Lifestream : Transmission.Transmission
    {
        public override string Name => "Lifestream";

        public Lifestream(ITransmissionProxy proxy,
                          ITorrentFileInfoReader torrentFileInfoReader,
                          IHttpClient httpClient,
                          IConfigService configService,
                          IDiskProvider diskProvider,
                          IRemotePathMappingService remotePathMappingService,
                          ILocalizationService localizationService,
                          IBlocklistService blocklistService,
                          Logger logger)
            : base(proxy, torrentFileInfoReader, httpClient, configService, diskProvider, remotePathMappingService, localizationService, blocklistService, logger)
        {
        }
    }
}
