import React from 'react';
import styles from './BoxOfX.css';

// The big animated orb on the home screen, with Midgar's plate as its emblem.
function Orb() {
  const reactors = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;

    return {
      x: 50 + Math.cos(angle) * 30,
      y: 50 + Math.sin(angle) * 30,
    };
  });

  return (
    <div className={styles.orb} aria-hidden={true}>
      <div className={styles.shellOuter} />
      <div className={styles.shellSpin} />
      <div className={styles.shellJelly} />
      <div className={styles.shellCore} />
      <div className={styles.gloss} />
      <div className={styles.emblem}>
        <svg width="150" height="150" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="rgba(255,255,230,0.8)"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="22"
            fill="none"
            stroke="rgba(255,255,230,0.55)"
            strokeWidth="3"
          />
          {reactors.map(({ x, y }) => (
            <circle
              key={`${x}:${y}`}
              cx={x}
              cy={y}
              r="4.5"
              fill="rgba(255,255,230,0.85)"
            />
          ))}
          <rect
            x="46"
            y="20"
            width="8"
            height="60"
            rx="3"
            fill="rgba(255,255,230,0.85)"
          />
        </svg>
      </div>
    </div>
  );
}

export default Orb;
