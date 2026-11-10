import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import { fetchDiskSpace, fetchTasks } from 'Store/Actions/systemActions';
import createAjaxRequest from 'Utilities/createAjaxRequest';
import { BadgeKind } from './StatusBadge';

export interface MidgarStatus {
  kind: BadgeKind;
  title: string;
  detail: string;
  queueCount: number;
  missingCount: number | undefined;
  freeSpace: number | undefined;
  nextRssSync: number | undefined;
  seriesCount: number;
  startTime: number | undefined;
}

const REFRESH_MS = 5 * 60 * 1000;

// The missing-episode count isn't in the redux store, so it's shared here.
let missingCountValue: number | undefined = undefined;
const missingListeners = new Set<(value: number | undefined) => void>();

function setMissingCount(value: number | undefined) {
  missingCountValue = value;
  missingListeners.forEach((listener) => listener(value));
}

function useMissingCount() {
  const [value, setValue] = useState(missingCountValue);

  useEffect(() => {
    missingListeners.add(setValue);
    setValue(missingCountValue);

    return () => {
      missingListeners.delete(setValue);
    };
  }, []);

  return value;
}

// Keeps disk space, scheduled tasks and the missing-episode count fresh while
// the window is open. Health and queue status are already polled by the menu.
export function useMidgarPolling() {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    const refresh = () => {
      dispatch(fetchDiskSpace());
      dispatch(fetchTasks());

      createAjaxRequest({
        global: false,
        dataType: 'json',
        url: '/wanted/missing',
        data: { page: 1, pageSize: 1, monitored: true },
      })
        .request.then((data: { totalRecords: number }) => {
          if (!cancelled) {
            setMissingCount(data.totalRecords);
          }
        })
        .catch(() => undefined);
    };

    refresh();
    const id = window.setInterval(refresh, REFRESH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [dispatch]);
}

// Turns health, connection and queue state into the badge, headline and
// numbers shown in the info window and the status line.
export default function useMidgarStatus(): MidgarStatus {
  const missingCount = useMissingCount();
  const isConnected = useSelector((state: AppState) => state.app.isConnected);
  const isReconnecting = useSelector(
    (state: AppState) => state.app.isReconnecting
  );
  const health = useSelector((state: AppState) => state.system.health.items);
  const queueStatus = useSelector((state: AppState) => state.queue.status.item);
  const disks = useSelector((state: AppState) => state.system.diskSpace.items);
  const tasks = useSelector((state: AppState) => state.system.tasks.items);
  const startTime = useSelector(
    (state: AppState) => state.system.status.item.startTime
  );
  const seriesCount = useSelector(
    (state: AppState) => state.series.items.length
  );

  return useMemo(() => {
    const errors = health.filter((h) => h.type === 'error');
    const warnings = health.filter((h) => h.type === 'warning');

    let kind: BadgeKind = 'good';
    let title = 'ALL SYSTEMS OK';
    let detail = 'Everything is running normally.';

    if (!isConnected) {
      kind = 'bad';
      title = isReconnecting ? 'RECONNECTING' : 'DISCONNECTED';
      detail = 'Lost contact with the Midgar service.';
    } else if (errors.length) {
      kind = 'bad';
      title = errors.length === 1 ? '1 PROBLEM' : `${errors.length} PROBLEMS`;
      detail = errors[0].message;
    } else if (warnings.length) {
      kind = 'warn';
      title =
        warnings.length === 1 ? '1 WARNING' : `${warnings.length} WARNINGS`;
      detail = warnings[0].message;
    }

    const freeSpace = disks.length
      ? disks.reduce((sum, d) => sum + d.freeSpace, 0)
      : undefined;

    const rss = tasks.find((t) => t.taskName === 'RssSync');

    return {
      kind,
      title,
      detail,
      queueCount: queueStatus?.totalCount ?? 0,
      missingCount,
      freeSpace,
      nextRssSync: rss?.nextExecution
        ? new Date(rss.nextExecution).getTime()
        : undefined,
      seriesCount,
      startTime: startTime ? new Date(startTime).getTime() : undefined,
    };
  }, [
    isConnected,
    isReconnecting,
    health,
    queueStatus,
    disks,
    tasks,
    missingCount,
    seriesCount,
    startTime,
  ]);
}
