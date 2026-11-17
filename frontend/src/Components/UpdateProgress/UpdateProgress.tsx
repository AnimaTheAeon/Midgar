import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import * as commandNames from 'Commands/commandNames';
import styles from './UpdateProgress.css';

// Midgar: one progress bar from "Install" until the new version answers,
// in every theme. Page.js keeps the "connection lost" and "updated" windows
// closed while this is showing.

interface Progress {
  phase: string;
  version: string | null;
  done: number;
  total: number;
  message: string | null;
  current: string;
}

interface View {
  title: string;
  fraction: number;
  step: string;
  note: string;
  failed: boolean;
}

let showing = false;

export function isUpdateShowing() {
  return showing;
}

const mb = (bytes: number) => (bytes / 1048576).toFixed(1);

// 1.15 and 1.15.0.0 are the same version.
const sameVersion = (a: string, b: string) => {
  const parts = (v: string) => {
    const p = v.split('.').map((n) => Number(n) || 0);

    while (p.length < 4) {
      p.push(0);
    }

    return p.join('.');
  };

  return parts(a) === parts(b);
};

async function fetchProgress(): Promise<Progress | null> {
  try {
    const response = await fetch(`${window.Sonarr.apiRoot}/update/progress`, {
      headers: { 'X-Api-Key': window.Sonarr.apiKey },
      cache: 'no-store',
    });

    return response.ok ? ((await response.json()) as Progress) : null;
  } catch {
    return null;
  }
}

function UpdateProgress() {
  const running = useSelector((state: AppState) =>
    state.commands.items.some(
      (command) =>
        command.name === commandNames.APPLICATION_UPDATE &&
        (command.status === 'queued' || command.status === 'started')
    )
  );

  // While the update waits its turn: what it's waiting for.
  const waitingFor = useSelector((state: AppState) => {
    const queued = state.commands.items.some(
      (command) =>
        command.name === commandNames.APPLICATION_UPDATE &&
        command.status === 'queued'
    );

    return queued
      ? state.commands.items
          .filter((command) => command.status === 'started')
          .map((command) => command.commandName || command.name)
          .join(', ')
      : '';
  });

  const runningRef = useRef(running);
  const waitingRef = useRef(waitingFor);
  runningRef.current = running;
  waitingRef.current = waitingFor;

  const [view, setView] = useState<View | null>(null);
  const [visible, setVisible] = useState(false);
  const target = useRef<string | null>(null);
  const restartAt = useRef(0);
  const startedAt = useRef(0);
  const finished = useRef(false);

  const poll = useCallback(async () => {
    if (finished.current) {
      return;
    }

    const progress = await fetchProgress();
    const lost = progress === null;

    // Only a running update starts the bar; an old failure doesn't.
    const runningPhase =
      progress !== null &&
      ['download', 'verify', 'extract', 'restart'].includes(progress.phase);

    // Pressed Install, but no download has started yet.
    if (!target.current && startedAt.current) {
      const ended = !runningRef.current;

      if (progress?.phase === 'failed' && ended) {
        setView({
          title: "The update didn't start",
          fraction: 0,
          step: '',
          note: `${
            progress.message ?? ''
          } Midgar keeps running the version you have.`,
          failed: true,
        });
        startedAt.current = 0;
        return;
      }

      if (!runningPhase) {
        if (ended && Date.now() - startedAt.current > 8000) {
          // It ended without saying why (an older Midgar on the other end).
          setView({
            title: "The update didn't start",
            fraction: 0,
            step: '',
            note: 'Midgar stopped before downloading anything. System > Log Files says why. Midgar keeps running the version you have.',
            failed: true,
          });
          startedAt.current = 0;
          return;
        }

        let step = 'Step 1 of 3 · Starting the download';

        if (waitingRef.current) {
          step = 'Step 1 of 3 · Waiting for other tasks to finish';
        } else if (progress?.phase === 'check') {
          step = 'Step 1 of 3 · Checking for the update';
        }

        setView({
          title: 'Updating Midgar',
          fraction: 0.02,
          step,
          note: waitingRef.current ? `Running now: ${waitingRef.current}` : '',
          failed: false,
        });
        return;
      }
    }

    if (
      runningPhase &&
      progress.version &&
      target.current !== progress.version
    ) {
      target.current = progress.version;
      restartAt.current = 0;
    }

    if (!target.current) {
      return;
    }

    const title = `Updating Midgar to ${target.current}`;

    if (progress && sameVersion(progress.current, target.current)) {
      finished.current = true;
      setView({
        title: `Midgar ${target.current} is installed`,
        fraction: 1,
        step: 'Done',
        note: 'Reloading the page…',
        failed: false,
      });
      window.setTimeout(() => window.location.reload(), 1800);
      return;
    }

    if (progress?.phase === 'failed') {
      setView({
        title: "The update didn't work",
        fraction: 0,
        step: '',
        note: `${
          progress.message ?? ''
        } Midgar keeps running the version you have.`,
        failed: true,
      });
      return;
    }

    if (lost || progress?.phase === 'restart') {
      if (!restartAt.current) {
        restartAt.current = Date.now();
      }

      const seconds = (Date.now() - restartAt.current) / 1000;

      setView({
        title,
        fraction: 0.9 + 0.08 * (1 - Math.exp(-seconds / 25)),
        step: 'Step 3 of 3 · Restarting',
        note:
          seconds > 120
            ? "It's taking longer than usual. If Midgar doesn't come back, start it again in Package Center (or from the Start menu on Windows)."
            : "Midgar is starting the new version. This page reloads by itself when it's back.",
        failed: false,
      });
      return;
    }

    if (progress?.phase === 'verify' || progress?.phase === 'extract') {
      setView({
        title,
        fraction: 0.84,
        step: 'Step 2 of 3 · Unpacking',
        note: '',
        failed: false,
      });
      return;
    }

    if (progress?.phase === 'download') {
      const fraction = progress.total
        ? Math.min(1, progress.done / progress.total)
        : 0;

      setView({
        title,
        fraction: 0.02 + 0.78 * fraction,
        step: progress.total
          ? `Step 1 of 3 · Downloading ${mb(progress.done)} of ${mb(
              progress.total
            )} MB`
          : 'Step 1 of 3 · Downloading',
        note: 'Searches keep working while it downloads.',
        failed: false,
      });
      return;
    }

    // Nothing running any more (the update decided there was nothing to do).
    if (Date.now() - startedAt.current > 8000) {
      target.current = null;
      setView(null);
    }
  }, []);

  // A page opened while an update is already running picks it up.
  useEffect(() => {
    poll();
  }, [poll]);

  useEffect(() => {
    if (running && !target.current) {
      startedAt.current = Date.now();
      setView({
        title: 'Updating Midgar',
        fraction: 0.02,
        step: 'Step 1 of 3 · Starting the download',
        note: '',
        failed: false,
      });
      poll();
    }
  }, [running, poll]);

  const active = running || view !== null;

  useEffect(() => {
    showing = active;

    if (!active) {
      return undefined;
    }

    const timer = window.setInterval(poll, 1000);

    return () => window.clearInterval(timer);
  }, [active, poll]);

  // Fade in and out slowly.
  useEffect(() => {
    if (view) {
      const frame = window.requestAnimationFrame(() => setVisible(true));

      return () => window.cancelAnimationFrame(frame);
    }

    setVisible(false);

    return undefined;
  }, [view]);

  const onOk = useCallback(() => {
    target.current = null;
    startedAt.current = 0;
    setView(null);
  }, []);

  if (!view) {
    return null;
  }

  return (
    <div
      className={visible ? `${styles.backdrop} ${styles.on}` : styles.backdrop}
      role="status"
      aria-live="polite"
    >
      <div
        className={
          view.failed ? `${styles.card} ${styles.failed}` : styles.card
        }
      >
        <div className={styles.title}>{view.title}</div>

        {view.failed ? null : (
          <>
            <div className={styles.bar}>
              <i style={{ width: `${(view.fraction * 100).toFixed(1)}%` }} />
            </div>

            <div className={styles.line}>
              <span>{view.step}</span>
              <span className={styles.percent}>
                {Math.round(view.fraction * 100)}%
              </span>
            </div>
          </>
        )}

        {view.note ? <div className={styles.note}>{view.note}</div> : null}

        {view.failed ? (
          <button className={styles.ok} onClick={onOk}>
            OK
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default UpdateProgress;
