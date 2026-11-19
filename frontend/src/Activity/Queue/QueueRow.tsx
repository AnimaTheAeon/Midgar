import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProtocolLabel from 'Activity/Queue/ProtocolLabel';
import { Error } from 'App/State/AppSectionState';
import IconButton from 'Components/Link/IconButton';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import ProgressBar from 'Components/ProgressBar';
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableSelectCell from 'Components/Table/Cells/TableSelectCell';
import Column from 'Components/Table/Column';
import phone from 'Components/Table/PhoneCard.css';
import TableRow from 'Components/Table/TableRow';
import Tooltip from 'Components/Tooltip/Tooltip';
import DownloadProtocol from 'DownloadClient/DownloadProtocol';
import EpisodeFormats from 'Episode/EpisodeFormats';
import EpisodeLanguages from 'Episode/EpisodeLanguages';
import EpisodeQuality from 'Episode/EpisodeQuality';
import EpisodeTitleLink from 'Episode/EpisodeTitleLink';
import SeasonEpisodeNumber from 'Episode/SeasonEpisodeNumber';
import useEpisode from 'Episode/useEpisode';
import useIsPhone from 'Helpers/Hooks/useIsPhone';
import { icons, kinds, tooltipPositions } from 'Helpers/Props';
import InteractiveImportModal from 'InteractiveImport/InteractiveImportModal';
import Language from 'Language/Language';
import { QualityModel } from 'Quality/Quality';
import SeriesTitleLink from 'Series/SeriesTitleLink';
import useSeries from 'Series/useSeries';
import { grabQueueItem, removeQueueItem } from 'Store/Actions/queueActions';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import CustomFormat from 'typings/CustomFormat';
import { SelectStateInputProps } from 'typings/props';
import {
  QueueTrackedDownloadState,
  QueueTrackedDownloadStatus,
  StatusMessage,
} from 'typings/Queue';
import formatTimeSpan from 'Utilities/Date/formatTimeSpan';
import formatBytes from 'Utilities/Number/formatBytes';
import formatCustomFormatScore from 'Utilities/Number/formatCustomFormatScore';
import translate from 'Utilities/String/translate';
import QueueStatusCell from './QueueStatusCell';
import RemoveQueueItemModal, { RemovePressProps } from './RemoveQueueItemModal';
import TimeleftCell from './TimeleftCell';
import styles from './QueueRow.css';

interface QueueRowProps {
  id: number;
  seriesId?: number;
  episodeId?: number;
  downloadId?: string;
  title: string;
  status: string;
  trackedDownloadStatus?: QueueTrackedDownloadStatus;
  trackedDownloadState?: QueueTrackedDownloadState;
  statusMessages?: StatusMessage[];
  errorMessage?: string;
  languages: Language[];
  quality: QualityModel;
  customFormats?: CustomFormat[];
  customFormatScore: number;
  protocol: DownloadProtocol;
  indexer?: string;
  outputPath?: string;
  downloadClient?: string;
  downloadClientHasPostImportCategory?: boolean;
  estimatedCompletionTime?: string;
  added?: string;
  timeleft?: string;
  size: number;
  sizeleft: number;
  isGrabbing?: boolean;
  grabError?: Error;
  isRemoving?: boolean;
  isSelected?: boolean;
  columns: Column[];
  onSelectedChange: (options: SelectStateInputProps) => void;
  onQueueRowModalOpenOrClose: (isOpen: boolean) => void;
}

// The download's state in a few plain words, for the phone card.
function phoneState(
  status: string,
  trackedDownloadStatus: QueueTrackedDownloadStatus | undefined,
  trackedDownloadState: QueueTrackedDownloadState | undefined,
  progress: number
): { text: string; kind: 'ok' | 'warn' | 'bad' | 'dim'; message?: string } {
  if (status === 'failed' || trackedDownloadStatus === 'error') {
    return { text: 'Failed', kind: 'bad' };
  }

  if (trackedDownloadState === 'importPending') {
    return { text: 'Waiting to import', kind: 'warn' };
  }

  if (trackedDownloadState === 'importing') {
    return { text: 'Importing', kind: 'ok' };
  }

  if (trackedDownloadState === 'failedPending') {
    return { text: 'Failed, waiting', kind: 'bad' };
  }

  if (trackedDownloadStatus === 'warning') {
    return { text: 'Needs a look', kind: 'warn' };
  }

  if (status === 'paused') {
    return { text: 'Paused', kind: 'dim' };
  }

  if (status === 'queued') {
    return { text: 'Queued', kind: 'dim' };
  }

  if (status === 'delay') {
    return { text: 'Waiting (delay profile)', kind: 'dim' };
  }

  if (status === 'downloadClientUnavailable') {
    return { text: 'Lifestream unreachable', kind: 'bad' };
  }

  if (status === 'completed') {
    return { text: 'Downloaded', kind: 'ok' };
  }

  return {
    text: progress > 0 ? `Downloading ${Math.floor(progress)}%` : 'Starting',
    kind: 'ok',
  };
}

function QueueRow(props: QueueRowProps) {
  const {
    id,
    seriesId,
    episodeId,
    downloadId,
    title,
    status,
    trackedDownloadStatus,
    trackedDownloadState,
    statusMessages,
    errorMessage,
    languages,
    quality,
    customFormats = [],
    customFormatScore,
    protocol,
    indexer,
    outputPath,
    downloadClient,
    downloadClientHasPostImportCategory,
    estimatedCompletionTime,
    added,
    timeleft,
    size,
    sizeleft,
    isGrabbing = false,
    grabError,
    isRemoving = false,
    isSelected,
    columns,
    onSelectedChange,
    onQueueRowModalOpenOrClose,
  } = props;

  const dispatch = useDispatch();
  const series = useSeries(seriesId);
  const episode = useEpisode(episodeId, 'episodes');
  const { showRelativeDates, shortDateFormat, timeFormat } = useSelector(
    createUISettingsSelector()
  );

  const [isRemoveQueueItemModalOpen, setIsRemoveQueueItemModalOpen] =
    useState(false);

  const [isInteractiveImportModalOpen, setIsInteractiveImportModalOpen] =
    useState(false);

  const handleGrabPress = useCallback(() => {
    dispatch(grabQueueItem({ id }));
  }, [id, dispatch]);

  const handleInteractiveImportPress = useCallback(() => {
    onQueueRowModalOpenOrClose(true);
    setIsInteractiveImportModalOpen(true);
  }, [setIsInteractiveImportModalOpen, onQueueRowModalOpenOrClose]);

  const handleInteractiveImportModalClose = useCallback(() => {
    onQueueRowModalOpenOrClose(false);
    setIsInteractiveImportModalOpen(false);
  }, [setIsInteractiveImportModalOpen, onQueueRowModalOpenOrClose]);

  const handleRemoveQueueItemPress = useCallback(() => {
    onQueueRowModalOpenOrClose(true);
    setIsRemoveQueueItemModalOpen(true);
  }, [setIsRemoveQueueItemModalOpen, onQueueRowModalOpenOrClose]);

  const handleRemoveQueueItemModalConfirmed = useCallback(
    (payload: RemovePressProps) => {
      onQueueRowModalOpenOrClose(false);
      dispatch(removeQueueItem({ id, ...payload }));
      setIsRemoveQueueItemModalOpen(false);
    },
    [id, setIsRemoveQueueItemModalOpen, onQueueRowModalOpenOrClose, dispatch]
  );

  const handleRemoveQueueItemModalClose = useCallback(() => {
    onQueueRowModalOpenOrClose(false);
    setIsRemoveQueueItemModalOpen(false);
  }, [setIsRemoveQueueItemModalOpen, onQueueRowModalOpenOrClose]);

  const isPhone = useIsPhone();
  const progress = 100 - (sizeleft / size) * 100;
  const showInteractiveImport =
    status === 'completed' && trackedDownloadStatus === 'warning';
  const isPending =
    status === 'delay' || status === 'downloadClientUnavailable';

  const modals = (
    <>
      <InteractiveImportModal
        isOpen={isInteractiveImportModalOpen}
        downloadId={downloadId}
        modalTitle={title}
        onModalClose={handleInteractiveImportModalClose}
      />

      <RemoveQueueItemModal
        isOpen={isRemoveQueueItemModalOpen}
        sourceTitle={title}
        canChangeCategory={!!downloadClientHasPostImportCategory}
        canIgnore={!!series}
        isPending={isPending}
        onRemovePress={handleRemoveQueueItemModalConfirmed}
        onModalClose={handleRemoveQueueItemModalClose}
      />
    </>
  );

  const actionButtons = (
    <>
      {showInteractiveImport ? (
        <IconButton
          name={icons.INTERACTIVE}
          title={translate('ManualImport')}
          onPress={handleInteractiveImportPress}
        />
      ) : null}

      {isPending ? (
        <SpinnerIconButton
          name={icons.DOWNLOAD}
          kind={grabError ? kinds.DANGER : kinds.DEFAULT}
          title={translate('Grab')}
          isSpinning={isGrabbing}
          onPress={handleGrabPress}
        />
      ) : null}

      <SpinnerIconButton
        title={translate('RemoveFromQueue')}
        name={icons.REMOVE}
        isSpinning={isRemoving}
        onPress={handleRemoveQueueItemPress}
      />
    </>
  );

  // Midgar on a phone: one card per download instead of a wide table row.
  if (isPhone) {
    const state = phoneState(
      status,
      trackedDownloadStatus,
      trackedDownloadState,
      progress
    );
    const left =
      status === 'downloading' && timeleft ? formatTimeSpan(timeleft) : '';

    return (
      <TableRow className={phone.phoneRow}>
        <TableSelectCell
          className={phone.phoneSelect}
          id={id}
          isSelected={isSelected}
          onSelectedChange={onSelectedChange}
        />

        <td className={phone.phoneCard} colSpan={columns.length + 1}>
          <div className={phone.phoneTop}>
            <div className={phone.phoneTitles}>
              <div className={phone.phoneSeries}>
                {series ? (
                  <SeriesTitleLink
                    titleSlug={series.titleSlug}
                    title={series.title}
                  />
                ) : (
                  title
                )}
              </div>

              {episode ? (
                <div className={phone.phoneEpisode}>
                  {`S${String(episode.seasonNumber).padStart(2, '0')}E${String(
                    episode.episodeNumber
                  ).padStart(2, '0')}`}
                  {episode.title ? ` · ${episode.title}` : ''}
                </div>
              ) : null}
            </div>

            <div className={phone.phoneActions}>{actionButtons}</div>
          </div>

          <div className={phone.phoneBar}>
            <ProgressBar
              progress={Math.max(0, Math.min(100, progress || 0))}
              title={`${(progress || 0).toFixed(1)}%`}
            />
          </div>

          <div className={phone.phoneMeta}>
            <span className={phone[state.kind]}>{state.text}</span>
            {quality ? <span>{quality.quality.name}</span> : null}
            <span>
              {status === 'downloading' && sizeleft
                ? `${formatBytes(sizeleft)} left`
                : formatBytes(size)}
            </span>
            {left ? <span>{left}</span> : null}
          </div>

          {state.message ? (
            <div className={phone.phoneMessage}>{state.message}</div>
          ) : null}
        </td>

        {modals}
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableSelectCell
        id={id}
        isSelected={isSelected}
        onSelectedChange={onSelectedChange}
      />

      {columns.map((column) => {
        const { name, isVisible } = column;

        if (!isVisible) {
          return null;
        }

        if (name === 'status') {
          return (
            <QueueStatusCell
              key={name}
              sourceTitle={title}
              status={status}
              trackedDownloadStatus={trackedDownloadStatus}
              trackedDownloadState={trackedDownloadState}
              statusMessages={statusMessages}
              errorMessage={errorMessage}
            />
          );
        }

        if (name === 'series.sortTitle') {
          return (
            <TableRowCell key={name}>
              {series ? (
                <SeriesTitleLink
                  titleSlug={series.titleSlug}
                  title={series.title}
                />
              ) : (
                title
              )}
            </TableRowCell>
          );
        }

        if (name === 'episode') {
          return (
            <TableRowCell key={name}>
              {episode ? (
                <SeasonEpisodeNumber
                  seasonNumber={episode.seasonNumber}
                  episodeNumber={episode.episodeNumber}
                  absoluteEpisodeNumber={episode.absoluteEpisodeNumber}
                  seriesType={series?.seriesType}
                  alternateTitles={series?.alternateTitles}
                  sceneSeasonNumber={episode.sceneSeasonNumber}
                  sceneEpisodeNumber={episode.sceneEpisodeNumber}
                  sceneAbsoluteEpisodeNumber={
                    episode.sceneAbsoluteEpisodeNumber
                  }
                  unverifiedSceneNumbering={episode.unverifiedSceneNumbering}
                />
              ) : (
                '-'
              )}
            </TableRowCell>
          );
        }

        if (name === 'episodes.title') {
          return (
            <TableRowCell key={name}>
              {series && episode ? (
                <EpisodeTitleLink
                  episodeId={episode.id}
                  seriesId={series.id}
                  episodeTitle={episode.title}
                  episodeEntity="episodes"
                  showOpenSeriesButton={true}
                />
              ) : (
                '-'
              )}
            </TableRowCell>
          );
        }

        if (name === 'episodes.airDateUtc') {
          if (episode) {
            return <RelativeDateCell key={name} date={episode.airDateUtc} />;
          }

          return <TableRowCell key={name}>-</TableRowCell>;
        }

        if (name === 'languages') {
          return (
            <TableRowCell key={name}>
              <EpisodeLanguages languages={languages} />
            </TableRowCell>
          );
        }

        if (name === 'quality') {
          return (
            <TableRowCell key={name}>
              {quality ? <EpisodeQuality quality={quality} /> : null}
            </TableRowCell>
          );
        }

        if (name === 'customFormats') {
          return (
            <TableRowCell key={name}>
              <EpisodeFormats formats={customFormats} />
            </TableRowCell>
          );
        }

        if (name === 'customFormatScore') {
          return (
            <TableRowCell key={name} className={styles.customFormatScore}>
              <Tooltip
                anchor={formatCustomFormatScore(
                  customFormatScore,
                  customFormats.length
                )}
                tooltip={<EpisodeFormats formats={customFormats} />}
                position={tooltipPositions.BOTTOM}
              />
            </TableRowCell>
          );
        }

        if (name === 'protocol') {
          return (
            <TableRowCell key={name}>
              <ProtocolLabel protocol={protocol} />
            </TableRowCell>
          );
        }

        if (name === 'indexer') {
          return <TableRowCell key={name}>{indexer}</TableRowCell>;
        }

        if (name === 'downloadClient') {
          return <TableRowCell key={name}>{downloadClient}</TableRowCell>;
        }

        if (name === 'title') {
          return <TableRowCell key={name}>{title}</TableRowCell>;
        }

        if (name === 'size') {
          return <TableRowCell key={name}>{formatBytes(size)}</TableRowCell>;
        }

        if (name === 'outputPath') {
          return <TableRowCell key={name}>{outputPath}</TableRowCell>;
        }

        if (name === 'estimatedCompletionTime') {
          return (
            <TimeleftCell
              key={name}
              status={status}
              estimatedCompletionTime={estimatedCompletionTime}
              timeleft={timeleft}
              size={size}
              sizeleft={sizeleft}
              showRelativeDates={showRelativeDates}
              shortDateFormat={shortDateFormat}
              timeFormat={timeFormat}
            />
          );
        }

        if (name === 'progress') {
          return (
            <TableRowCell key={name} className={styles.progress}>
              {!!progress && (
                <ProgressBar
                  progress={progress}
                  title={`${progress.toFixed(1)}%`}
                />
              )}
            </TableRowCell>
          );
        }

        if (name === 'added') {
          return <RelativeDateCell key={name} date={added} />;
        }

        if (name === 'actions') {
          return (
            <TableRowCell key={name} className={styles.actions}>
              {actionButtons}
            </TableRowCell>
          );
        }

        return null;
      })}

      {modals}
    </TableRow>
  );
}

export default QueueRow;
