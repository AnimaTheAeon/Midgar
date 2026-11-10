import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import Link from 'Components/Link/Link';
import { toggleAdvancedSettings } from 'Store/Actions/settingsActions';
import formatBytes from 'Utilities/Number/formatBytes';
import StatusBadge from './StatusBadge';
import useMidgarStatus from './useMidgarStatus';
import useNow, { formatClock } from './useNow';
import styles from './Midgar.css';

// The small window under the menu, like the Time / Gil box in FFVII.
function InfoWindow() {
  const dispatch = useDispatch();
  const now = useNow();
  const status = useMidgarStatus();
  const advanced = useSelector(
    (state: AppState) => state.settings.advancedSettings
  );

  const onModePress = useCallback(() => {
    dispatch(toggleAdvancedSettings());
  }, [dispatch]);

  const started = status.startTime ?? now;

  return (
    <section className={styles.infoWindow} aria-label="Status">
      <Link
        className={styles.infoHeadline}
        to="/system/status"
        title={status.detail}
      >
        <StatusBadge kind={status.kind} />
        <span className={styles[status.kind]}>{status.title}</span>
      </Link>

      <div className={styles.infoRow}>
        <span className={styles.label}>Time</span>
        <span className={styles.value}>
          {formatClock((now - started) / 1000)}
        </span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.label}>Queue</span>
        <span className={styles.value}>{status.queueCount}</span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.label}>Missing</span>
        <span
          className={
            status.missingCount
              ? `${styles.value} ${styles.warn}`
              : styles.value
          }
        >
          {status.missingCount ?? '—'}
        </span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.label}>Free</span>
        <span className={styles.value}>
          {status.freeSpace === undefined ? '—' : formatBytes(status.freeSpace)}
        </span>
      </div>

      <button
        type="button"
        className={styles.modeButton}
        title="Simple shows the settings most people need. Advanced shows everything."
        onClick={onModePress}
      >
        {advanced ? 'MODE: ADVANCED' : 'MODE: SIMPLE'}
      </button>
    </section>
  );
}

export default InfoWindow;
