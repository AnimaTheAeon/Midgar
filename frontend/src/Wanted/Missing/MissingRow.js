import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableSelectCell from 'Components/Table/Cells/TableSelectCell';
import phone from 'Components/Table/PhoneCard.css';
import TableRow from 'Components/Table/TableRow';
import episodeEntities from 'Episode/episodeEntities';
import EpisodeSearchCell from 'Episode/EpisodeSearchCell';
import EpisodeStatus from 'Episode/EpisodeStatus';
import EpisodeTitleLink from 'Episode/EpisodeTitleLink';
import SeasonEpisodeNumber from 'Episode/SeasonEpisodeNumber';
import useIsPhone from 'Helpers/Hooks/useIsPhone';
import SeriesTitleLink from 'Series/SeriesTitleLink';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import styles from './MissingRow.css';

function MissingRow(props) {
  const {
    id,
    episodeFileId,
    series,
    seasonNumber,
    episodeNumber,
    absoluteEpisodeNumber,
    sceneSeasonNumber,
    sceneEpisodeNumber,
    sceneAbsoluteEpisodeNumber,
    unverifiedSceneNumbering,
    airDateUtc,
    lastSearchTime,
    title,
    isSelected,
    columns,
    onSelectedChange
  } = props;

  const isPhone = useIsPhone();
  const { showRelativeDates, shortDateFormat } = useSelector(createUISettingsSelector());

  if (!series) {
    return null;
  }

  // Midgar on a phone: one card per missing episode, with its search buttons.
  if (isPhone) {
    const code = `S${String(seasonNumber).padStart(2, '0')}E${String(episodeNumber).padStart(2, '0')}`;
    const aired = getRelativeDate({ date: airDateUtc, shortDateFormat, showRelativeDates });

    return (
      <TableRow className={phone.phoneRow}>
        <TableSelectCell
          className={phone.phoneSelect}
          id={id}
          isSelected={isSelected}
          onSelectedChange={onSelectedChange}
        />

        <td className={phone.phoneCard}>
          <div className={phone.phoneSeries}>
            <SeriesTitleLink
              titleSlug={series.titleSlug}
              title={series.title}
            />
          </div>

          <div className={phone.phoneEpisodeRow}>
            <span>{code} ·</span>
            <div className={phone.phoneEpisodeTitle}>
              <EpisodeTitleLink
                episodeId={id}
                seriesId={series.id}
                episodeEntity={episodeEntities.WANTED_MISSING}
                episodeTitle={title}
                showOpenSeriesButton={true}
              />
            </div>
          </div>

          {aired ? (
            <div className={phone.phoneMeta}>
              <span>Aired {aired}</span>
            </div>
          ) : null}
        </td>

        <EpisodeSearchCell
          className={phone.phoneSide}
          episodeId={id}
          seriesId={series.id}
          episodeTitle={title}
          episodeEntity={episodeEntities.WANTED_MISSING}
          showOpenSeriesButton={true}
        />
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

      {
        columns.map((column) => {
          const {
            name,
            isVisible
          } = column;

          if (!isVisible) {
            return null;
          }

          if (name === 'series.sortTitle') {
            return (
              <TableRowCell key={name}>
                <SeriesTitleLink
                  titleSlug={series.titleSlug}
                  title={series.title}
                />
              </TableRowCell>
            );
          }

          if (name === 'episode') {
            return (
              <TableRowCell
                key={name}
                className={styles.episode}
              >
                <SeasonEpisodeNumber
                  seasonNumber={seasonNumber}
                  episodeNumber={episodeNumber}
                  absoluteEpisodeNumber={absoluteEpisodeNumber}
                  seriesType={series.seriesType}
                  alternateTitles={series.alternateTitles}
                  sceneSeasonNumber={sceneSeasonNumber}
                  sceneEpisodeNumber={sceneEpisodeNumber}
                  sceneAbsoluteEpisodeNumber={sceneAbsoluteEpisodeNumber}
                  unverifiedSceneNumbering={unverifiedSceneNumbering}
                />
              </TableRowCell>
            );
          }

          if (name === 'episodes.title') {
            return (
              <TableRowCell key={name}>
                <EpisodeTitleLink
                  episodeId={id}
                  seriesId={series.id}
                  episodeEntity={episodeEntities.WANTED_MISSING}
                  episodeTitle={title}
                  showOpenSeriesButton={true}
                />
              </TableRowCell>
            );
          }

          if (name === 'episodes.airDateUtc') {
            return (
              <RelativeDateCell
                key={name}
                date={airDateUtc}
              />
            );
          }

          if (name === 'episodes.lastSearchTime') {
            return (
              <RelativeDateCell
                key={name}
                date={lastSearchTime}
                includeSeconds={true}
              />
            );
          }

          if (name === 'status') {
            return (
              <TableRowCell
                key={name}
                className={styles.status}
              >
                <EpisodeStatus
                  episodeId={id}
                  episodeFileId={episodeFileId}
                  episodeEntity={episodeEntities.WANTED_MISSING}
                />
              </TableRowCell>
            );
          }

          if (name === 'actions') {
            return (
              <EpisodeSearchCell
                key={name}
                episodeId={id}
                seriesId={series.id}
                episodeTitle={title}
                episodeEntity={episodeEntities.WANTED_MISSING}
                showOpenSeriesButton={true}
              />
            );
          }

          return null;
        })
      }
    </TableRow>
  );
}

MissingRow.propTypes = {
  id: PropTypes.number.isRequired,
  episodeFileId: PropTypes.number,
  series: PropTypes.object.isRequired,
  seasonNumber: PropTypes.number.isRequired,
  episodeNumber: PropTypes.number.isRequired,
  absoluteEpisodeNumber: PropTypes.number,
  sceneSeasonNumber: PropTypes.number,
  sceneEpisodeNumber: PropTypes.number,
  sceneAbsoluteEpisodeNumber: PropTypes.number,
  unverifiedSceneNumbering: PropTypes.bool.isRequired,
  airDateUtc: PropTypes.string.isRequired,
  lastSearchTime: PropTypes.string,
  title: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectedChange: PropTypes.func.isRequired
};

export default MissingRow;
