using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
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
        // A release nobody is sharing never finishes. Lifestream counts how long a
        // download has been trying without getting any data (only while it is
        // really downloading and the network works); past this, Midgar treats it as
        // failed: it blocks that release and searches for another one.
        private static readonly TimeSpan StallLimit = TimeSpan.FromMinutes(30);

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

        public override IEnumerable<DownloadClientItem> GetItems()
        {
            var items = base.GetItems().ToList();
            Dictionary<string, long> stalled;

            try
            {
                stalled = GetStalledSeconds();
            }
            catch (Exception ex)
            {
                _logger.Debug(ex, "Couldn't ask Lifestream which downloads are stuck");

                return items;
            }

            foreach (var item in items)
            {
                // No size check: a magnet that never got its details reports 0 left.
                // Lifestream only counts while a download is unfinished.
                if (item.Status != DownloadItemStatus.Completed &&
                    item.Status != DownloadItemStatus.Failed &&
                    item.DownloadId != null &&
                    stalled.TryGetValue(item.DownloadId.ToLowerInvariant(), out var seconds) &&
                    seconds >= StallLimit.TotalSeconds)
                {
                    item.Status = DownloadItemStatus.Failed;
                    item.Message = $"No data for {(int)StallLimit.TotalMinutes} minutes: nobody is sharing this release. Midgar will try another one.";
                }
            }

            return items;
        }

        private Dictionary<string, long> GetStalledSeconds()
        {
            var arguments = new Dictionary<string, object>
            {
                { "fields", new[] { "hashString", "lifestreamStalledSecs" } }
            };

            var response = _proxy.ProcessRequest("torrent-get", arguments, Settings);
            var result = new Dictionary<string, long>();

            if (response?.Arguments == null || !response.Arguments.TryGetValue("torrents", out var list) || list is not JArray torrents)
            {
                return result;
            }

            foreach (var torrent in torrents.OfType<JObject>())
            {
                var hash = torrent.Value<string>("hashString");
                var seconds = torrent["lifestreamStalledSecs"]?.Value<long>() ?? 0;

                if (hash != null)
                {
                    result[hash.ToLowerInvariant()] = seconds;
                }
            }

            return result;
        }
    }
}
