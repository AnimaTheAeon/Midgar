import React from 'react';
import styles from './Midgar.css';

export type BadgeKind = 'good' | 'warn' | 'bad';

interface StatusBadgeProps {
  kind: BadgeKind;
  size?: number;
  label?: string;
}

const FILL: Record<BadgeKind, string> = {
  good: '#1e9a46',
  warn: '#c89614',
  bad: '#b43c3c',
};

// Round status badge: check for good, ! for warn, × for bad (same as Lifestream).
function StatusBadge({ kind, size = 20, label }: StatusBadgeProps) {
  return (
    <svg
      className={styles.badge}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <circle
        cx="10"
        cy="10"
        r="9"
        fill={FILL[kind]}
        stroke="#d6d8e4"
        strokeWidth="1.5"
      />
      {kind === 'good' ? (
        <path
          d="M5.5 10.5l3 3 6-7"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      {kind === 'warn' ? (
        <path
          d="M10 5v6M10 14v.5"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ) : null}
      {kind === 'bad' ? (
        <path
          d="M6.5 6.5l7 7M13.5 6.5l-7 7"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}

export default StatusBadge;
