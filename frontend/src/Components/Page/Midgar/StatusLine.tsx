import React from 'react';
import Link from 'Components/Link/Link';
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

// What the status line says; also used by the Box of X status box.
export function useStatusSummary(includeQueue = true) {
  const now = useNow();
  const status = useMidgarStatus();
  const update = useMidgarUpdate();

  const parts: string[] = [];

  if (status.kind === 'good') {
    if (status.nextRssSync !== undefined) {
      parts.push(`RSS sync in ${formatCountdown(status.nextRssSync - now)}`);
    }

    if (includeQueue) {
      parts.push(
        status.queueCount === 1 ? '1 in queue' : `${status.queueCount} in queue`
      );
    }

    parts.push(
      status.seriesCount === 1 ? '1 series' : `${status.seriesCount} series`
    );
  } else {
    parts.push(status.detail);
  }

  return {
    status,
    text: parts.join(' · '),
    // The Updates page has the Install button (or the package download).
    update: update ? { version: update.version } : undefined,
  };
}

// The status line along the bottom of the window.
function StatusLine() {
  // The info window above already shows the queue count.
  const { status, text, update } = useStatusSummary(false);

  return (
    <footer className={styles.statusLine}>
      <StatusBadge kind={status.kind} size={18} />
      <span
        className={status.kind === 'good' ? undefined : styles[status.kind]}
      >
        {text}
      </span>

      {update ? (
        <Link
          className={styles.update}
          to="/system/updates"
          title="Open the Updates page to install it."
        >
          UPDATE {update.version} READY
        </Link>
      ) : null}
    </footer>
  );
}

export default StatusLine;
