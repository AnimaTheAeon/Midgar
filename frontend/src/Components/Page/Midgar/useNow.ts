import { useEffect, useState } from 'react';

// Ticks once a second so the FFVII-style clocks keep moving.
export default function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(
    s % 60
  )}`;
}
