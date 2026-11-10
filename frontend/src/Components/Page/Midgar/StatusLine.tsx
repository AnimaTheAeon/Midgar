import React from 'react';
import { useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import StatusBadge from './StatusBadge';
import useMidgarStatus from './useMidgarStatus';
import useMidgarUpdate from './useMidgarUpdate';
import useNow from './useNow';
import styles from './Midgar.css';

function formatCountdown(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);

  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// The status line along the bottom of the window.
function StatusLine() {
  const now = useNow();
  const status = useMidgarStatus();
  const update = useMidgarUpdate();
  const isWindows = useSelector(
    (state: AppState) => state.system.status.item.isWindows
  );

  const parts: string[] = [];

  if (status.kind === 'good') {
    if (status.nextRssSync !== undefined) {
      parts.push(`RSS sync in ${formatCountdown(status.nextRssSync - now)}`);
    }

    parts.push(
      status.queueCount === 1 ? '1 in queue' : `${status.queueCount} in queue`
    );

    parts.push(
      status.seriesCount === 1 ? '1 series' : `${status.seriesCount} series`
    );
  } else {
    parts.push(status.detail);
  }

  return (
    <footer className={styles.statusLine}>
      <StatusBadge kind={status.kind} size={18} />
      <span
        className={status.kind === 'good' ? undefined : styles[status.kind]}
      >
        {parts.join(' · ')}
      </span>

      {update ? (
        <a
          className={styles.update}
          href={(isWindows ? update.pageUrl : update.spkUrl) ?? update.pageUrl}
          target="_blank"
          rel="noreferrer"
          title={
            isWindows
              ? 'Right-click the Midgar tray icon and pick Install update.'
              : 'Download the new package, then in Package Center choose Manual Install. Your settings and library are kept.'
          }
        >
          UPDATE {update.version} READY
        </a>
      ) : null}
    </footer>
  );
}

export default StatusLine;
