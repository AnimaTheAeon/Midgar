import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { REFRESH_SERIES, SERIES_SEARCH } from 'Commands/commandNames';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import HandCursor from 'Components/Page/Midgar/HandCursor';
import { icons } from 'Helpers/Props';
import DeleteSeriesModal from 'Series/Delete/DeleteSeriesModal';
import EditSeriesModal from 'Series/Edit/EditSeriesModal';
import SeriesIndexPosterSelect from 'Series/Index/Select/SeriesIndexPosterSelect';
import { SeriesStatus, Statistics } from 'Series/Series';
import SeriesPoster from 'Series/SeriesPoster';
import { executeCommand } from 'Store/Actions/commandActions';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import createSeriesIndexItemSelector from '../createSeriesIndexItemSelector';
import styles from './SeriesIndexPartyRow.css';

export const PARTY_ROW_HEIGHT = 112;
const PORTRAIT_WIDTH = 66;
const PORTRAIT_HEIGHT = 96;

type Tone = 'good' | 'warn' | 'bad' | 'info' | 'off';

function getTag(
  monitored: boolean,
  missing: number,
  status: SeriesStatus
): { text: string; tone: Tone } {
  if (!monitored) {
    return { text: 'OFF', tone: 'off' };
  }

  if (missing > 0) {
    return { text: `MISSING ${missing}`, tone: 'warn' };
  }

  switch (status) {
    case 'deleted':
      return { text: translate('Deleted').toUpperCase(), tone: 'bad' };
    case 'ended':
      return { text: translate('Ended').toUpperCase(), tone: 'off' };
    case 'upcoming':
      return { text: translate('Upcoming').toUpperCase(), tone: 'info' };
    default:
      return { text: translate('Continuing').toUpperCase(), tone: 'good' };
  }
}

interface SeriesIndexPartyRowProps {
  seriesId: number;
  isSelectMode: boolean;
}

// One series drawn like an FFVII party member: portrait, name, LV, EP gauge.
function SeriesIndexPartyRow({
  seriesId,
  isSelectMode,
}: SeriesIndexPartyRowProps) {
  const { series, qualityProfile, isRefreshingSeries, isSearchingSeries } =
    useSelector(createSeriesIndexItemSelector(seriesId));
  const { shortDateFormat, showRelativeDates, timeFormat } = useSelector(
    createUISettingsSelector()
  );

  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const onRefreshPress = useCallback(() => {
    dispatch(executeCommand({ name: REFRESH_SERIES, seriesId }));
  }, [seriesId, dispatch]);

  const onSearchPress = useCallback(() => {
    dispatch(executeCommand({ name: SERIES_SEARCH, seriesId }));
  }, [seriesId, dispatch]);

  const onEditPress = useCallback(() => setIsEditOpen(true), []);
  const onEditClose = useCallback(() => setIsEditOpen(false), []);
  const onDeletePress = useCallback(() => {
    setIsEditOpen(false);
    setIsDeleteOpen(true);
  }, []);
  const onDeleteClose = useCallback(() => setIsDeleteOpen(false), []);

  const {
    title,
    titleSlug,
    monitored,
    status,
    nextAiring,
    images,
    statistics = {} as Statistics,
  } = series;

  const {
    seasonCount = 0,
    episodeCount = 0,
    episodeFileCount = 0,
    sizeOnDisk = 0,
  } = statistics;

  const missing = Math.max(0, episodeCount - episodeFileCount);
  const percent = episodeCount
    ? Math.min(100, (episodeFileCount / episodeCount) * 100)
    : 0;

  const tag = getTag(monitored, missing, status);

  let gauge: Tone = 'good';

  if (!monitored) {
    gauge = 'off';
  } else if (missing > 0) {
    gauge = episodeFileCount === 0 ? 'bad' : 'warn';
  }

  const next = nextAiring
    ? getRelativeDate({
        date: nextAiring,
        shortDateFormat,
        showRelativeDates,
        timeFormat,
        timeForToday: true,
      })
    : '—';

  const link = `/series/${titleSlug}`;
  const portraitStyle = {
    width: `${PORTRAIT_WIDTH}px`,
    height: `${PORTRAIT_HEIGHT}px`,
  };

  return (
    <div className={styles.row}>
      <HandCursor className={styles.hand} />

      <div className={styles.portrait}>
        {isSelectMode ? <SeriesIndexPosterSelect seriesId={seriesId} /> : null}

        <Link to={link} style={portraitStyle} tabIndex={-1}>
          <SeriesPoster
            className={styles.portraitImage}
            style={portraitStyle}
            images={images}
            size={250}
            lazy={false}
            overflow={true}
          />
        </Link>
      </div>

      <div className={styles.identity}>
        <Link className={styles.name} to={link}>
          {title}
        </Link>

        <div className={styles.stats}>
          <span>
            <span className={styles.label}>LV</span> {seasonCount}
          </span>
          <span>
            <span className={styles.label}>NEXT</span> {next}
          </span>
          <span>
            <span className={styles.label}>Q</span>{' '}
            {qualityProfile?.name ?? '—'}
          </span>
        </div>
      </div>

      <div className={styles.gauges}>
        <div className={styles.gaugeHead}>
          <span className={styles.label}>EP</span>
          <span className={styles.value}>
            {episodeFileCount} / {episodeCount}
          </span>
        </div>
        <div
          className={styles.bar}
          role="progressbar"
          aria-label={`${title} episodes on disk`}
          aria-valuemin={0}
          aria-valuemax={episodeCount}
          aria-valuenow={episodeFileCount}
        >
          <div
            className={classNames(styles.fill, styles[gauge])}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className={styles.gaugeHead}>
          <span className={styles.label}>SIZE</span>
          <span className={styles.value}>{formatBytes(sizeOnDisk)}</span>
        </div>
      </div>

      <span className={classNames(styles.tag, styles[`${tag.tone}Text`])}>
        {tag.text}
      </span>

      <div className={styles.actions}>
        <SpinnerIconButton
          name={icons.REFRESH}
          title={translate('RefreshSeries')}
          isSpinning={isRefreshingSeries}
          onPress={onRefreshPress}
        />

        <SpinnerIconButton
          name={icons.SEARCH}
          title={translate('SearchForMonitoredEpisodes')}
          isSpinning={isSearchingSeries}
          onPress={onSearchPress}
        />

        <IconButton
          name={icons.EDIT}
          title={translate('EditSeries')}
          onPress={onEditPress}
        />
      </div>

      <EditSeriesModal
        isOpen={isEditOpen}
        seriesId={seriesId}
        onModalClose={onEditClose}
        onDeleteSeriesPress={onDeletePress}
      />

      <DeleteSeriesModal
        isOpen={isDeleteOpen}
        seriesId={seriesId}
        onModalClose={onDeleteClose}
      />
    </div>
  );
}

export default SeriesIndexPartyRow;
