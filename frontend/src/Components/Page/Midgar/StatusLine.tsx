import React from 'react';
import StatusBadge from './StatusBadge';
import useMidgarStatus from './useMidgarStatus';
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
    </footer>
  );
}

export default StatusLine;
