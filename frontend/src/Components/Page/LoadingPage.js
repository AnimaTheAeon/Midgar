import React, { useMemo } from 'react';
import styles from './LoadingPage.css';

// Midgar's own start screen: the plate (two slow rings, eight reactors and the
// central pillar) over the app's name. Everything fades in gently and moves
// slowly; nothing flashes.
const STATUS = [
  'Powering the reactors',
  'Reading the plate',
  'Opening the gates',
  'Looking in on your series'
];

const REACTORS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4 - Math.PI / 2;
  return { x: Math.cos(a) * 62, y: Math.sin(a) * 62, delay: i * 0.55 };
});

const SPOKES = Array.from({ length: 4 }, (_, i) => {
  const a = (i * Math.PI) / 2 + Math.PI / 4;
  return { x: Math.cos(a) * 36, y: Math.sin(a) * 36 };
});

function Plate() {
  return (
    <svg
      className={styles.emblem}
      viewBox="-100 -100 200 200"
      aria-hidden="true"
    >
      <g className={styles.ringOuter}>
        <circle r="86" className={styles.line}
          strokeWidth="2"
        />
        {Array.from({ length: 24 }, (_, i) => (
          <line
            key={i}
            className={styles.tick}
            x1="0"
            y1="-86"
            x2="0"
            y2="-92"
            transform={`rotate(${i * 15})`}
          />
        ))}
      </g>

      <g className={styles.ringInner}>
        <circle
          r="62"
          className={styles.line}
          strokeWidth="1.5"
          strokeDasharray="2 7"
        />
      </g>

      <circle r="36" className={styles.line}
        strokeWidth="1.5"
      />

      {SPOKES.map((s, i) => (
        <line
          key={i}
          className={styles.lineDim}
          x1="0"
          y1="0"
          x2={s.x}
          y2={s.y}
          strokeWidth="1"
        />
      ))}

      {REACTORS.map((r, i) => (
        <circle
          key={i}
          className={styles.reactor}
          cx={r.x}
          cy={r.y}
          r="5.5"
          style={{ animationDelay: `${r.delay}s` }}
        />
      ))}

      <rect
        className={styles.pillar}
        x="-5"
        y="-30"
        width="10"
        height="60"
        rx="2"
      />
      <rect
        className={styles.pillarCap}
        x="-11"
        y="-34"
        width="22"
        height="6"
        rx="2"
      />
    </svg>
  );
}

function LoadingPage() {
  const status = useMemo(
    () => STATUS[Math.floor(Math.random() * STATUS.length)],
    []
  );

  return (
    <div className={styles.page}>
      <div className={styles.stage}>
        <Plate />
        <div className={styles.title}>M I D G A R</div>
        <div className={styles.bar}>
          <div className={styles.barGlide} />
        </div>
        <div className={styles.status}>{status}…</div>
      </div>
    </div>
  );
}

export default LoadingPage;
