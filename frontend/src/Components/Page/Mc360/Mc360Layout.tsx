import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import QueueStatus from 'Activity/Queue/Status/QueueStatus';
import AppState from 'App/State/AppState';
import KeyboardShortcutsModal from 'Components/Page/Header/KeyboardShortcutsModal';
import PageHeaderActionsMenu from 'Components/Page/Header/PageHeaderActionsMenu';
import SeriesSearchInputConnector from 'Components/Page/Header/SeriesSearchInputConnector';
import { useStatusSummary } from 'Components/Page/Midgar/StatusLine';
import { checkMidgarUpdateNow } from 'Components/Page/Midgar/useMidgarUpdate';
import MessagesConnector from 'Components/Page/Sidebar/Messages/MessagesConnector';
import { getActiveParent, links } from 'Components/Page/Sidebar/PageSidebar';
import { saveUISettings } from 'Store/Actions/settingsActions';
import HealthStatus from 'System/Status/Health/HealthStatus';
import styles from './Mc360.css';

// Midgar: the "MC360" look. Skin blades from the MC360 dashboard, one per menu
// section; each blade's menu lists that section's pages. Pick one and the page
// opens on the blade, exactly as it is in every other look. The drawing,
// sounds and keys come from the shared MC360 engine (Content/MC360).

interface NavLink {
  title: () => string;
  to: string;
  alias?: string;
  isAdvanced?: boolean;
  children?: NavLink[];
  exact?: boolean;
}

interface EngineItem {
  id: string;
  label: string;
  icon: string;
  hint: string;
}

interface Engine {
  host: HTMLElement;
  showPage: (blade: number, id: string) => void;
  home: (blade?: number) => void;
  refresh: () => void;
  toast: (title: string, text: string) => void;
  setBlades: (blades: unknown[]) => void;
  state: () => { tier: number; b: number };
  destroy: () => void;
}

declare global {
  interface Window {
    MC360?: { mount: (options: unknown) => Engine };
  }
}

const sections = links as NavLink[];

const LOOKS: Record<string, string> = {
  'FFVII Menu': 'midgar',
  Xbox: 'boxofx',
  Blades: 'blades',
  'Dark Glass': 'glass',
  MC360: 'mc360',
};

const COLORS = ['blue', 'orange', 'green', 'red', 'purple', 'grey'];

const PAGES: Record<string, [string, string]> = {
  '/': ['tv', 'Your shows, with search, edit and rename.'],
  '/add/new': ['plus', 'Find a new show.'],
  '/add/import': ['folder', 'Bring in folders you already have.'],
  '/calendar': ['cal', 'Upcoming episodes by day.'],
  '/activity/queue': ['queue', 'Downloads in progress.'],
  '/activity/history': ['clock', 'Grabs, imports, failures.'],
  '/activity/blocklist': ['block', 'Releases that won’t be grabbed again.'],
  '/wanted/missing': ['search', 'Aired but not downloaded.'],
  '/wanted/cutoffunmet': ['star', 'Below your wanted quality.'],
  '/settings': ['gear', 'Every setting, in one list.'],
  '/settings/mediamanagement': ['folder', 'Naming, folders, hardlinks.'],
  '/settings/indexers': ['search', 'Synced from Materia.'],
  '/settings/downloadclients': ['plug', 'Lifestream connection.'],
  '/settings/connect': ['bell', 'Where alerts go.'],
  '/settings/tags': ['tag', 'Tags and what uses them.'],
  '/settings/ui': ['palette', 'Look, sounds and motion.'],
  '/system/status': ['info', 'Health checks and versions.'],
  '/system/tasks': ['task', 'Scheduled jobs, with Run now.'],
  '/system/backup': ['disk', 'Make and restore backups.'],
  '/system/updates': ['refresh', 'Check now and Update now.'],
  '/system/events': ['bell', 'What the app has been doing.'],
  '/system/logs/files': ['doc', 'Read and download log files.'],
};

function stripUrlBase(pathname: string) {
  const urlBase = window.Sonarr.urlBase;

  return urlBase ? pathname.substr(urlBase.length) || '/' : pathname;
}

function isTabActive(tab: NavLink, pathname: string) {
  if (tab.to === '/') {
    return (
      pathname === '/' ||
      (!!tab.alias && pathname.startsWith(tab.alias)) ||
      pathname.startsWith('/serieseditor')
    );
  }

  if (tab.exact) {
    return pathname === tab.to;
  }

  return pathname === tab.to || pathname.startsWith(`${tab.to}/`);
}

function sectionTabs(section: NavLink, showAdvanced: boolean) {
  const children = (section.children ?? []).filter(
    (child) => showAdvanced || !child.isAdvanced
  );

  if (children.some((child) => child.to === section.to)) {
    return children;
  }

  return [
    { title: section.title, to: section.to, alias: section.alias },
    ...children,
  ];
}

function bladesFor(showAdvanced: boolean) {
  return sections.map((section, i) => ({
    key: section.title().toLowerCase(),
    color: COLORS[i % COLORS.length],
    items: sectionTabs(section, showAdvanced).map((tab): EngineItem => {
      const [icon, hint] = PAGES[tab.to] ?? [
        'gear',
        `${tab.title()} settings.`,
      ];

      return { id: tab.to, label: tab.title(), icon, hint };
    }),
  }));
}

// Where the current address sits: the blade, and the menu entry it belongs to.
function locate(pathname: string, showAdvanced: boolean) {
  const path = pathname === '/home' ? '/' : pathname;
  const parent = getActiveParent(path);
  const b = Math.max(
    0,
    sections.findIndex((section) => section.to === parent)
  );
  const tabs = sectionTabs(sections[b], showAdvanced);
  const hits = tabs.filter((tab) => isTabActive(tab, path));
  const tab = hits[hits.length - 1] ?? tabs[0];

  return { b, id: tab.to };
}

function isPopupOpen() {
  // Dialogs and open menus render under #portal-root; closed ones leave
  // zero-size holders there, so look for something that takes up space.
  const portal = document.getElementById('portal-root');

  if (!portal) {
    return false;
  }

  return Array.from(portal.querySelectorAll('*')).some((element) => {
    const rect = element.getBoundingClientRect();

    return rect.width > 24 && rect.height > 24;
  });
}

function loadOnce(id: string, make: () => HTMLElement) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) {
      if (window.MC360 || id.endsWith('css')) {
        resolve();
      } else {
        document.getElementById(id)?.addEventListener('load', () => resolve());
      }
      return;
    }

    const element = make();
    element.id = id;
    element.addEventListener('load', () => resolve());
    element.addEventListener('error', () => reject());
    document.head.appendChild(element);
  });
}

// The server lets browsers keep /Content files for a year, so the engine's
// address carries the app version: an update always loads the new engine.
function loadEngine(base: string) {
  const v = encodeURIComponent(
    window.Sonarr.appVersion || window.Sonarr.version || ''
  );
  const css = loadOnce('mc360-css', () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${base}mc360.css?v=${v}`;
    return link;
  });
  const js = loadOnce('mc360-js', () => {
    const script = document.createElement('script');
    script.src = `${base}mc360.js?v=${v}`;
    return script;
  });

  return Promise.all([css, js]);
}

interface Mc360LayoutProps {
  location: { pathname: string };
  children: React.ReactNode;
}

function Mc360Layout({ location, children }: Mc360LayoutProps) {
  const history = useHistory();
  const dispatch = useDispatch();
  const pathname = stripUrlBase(location.pathname);
  const showAdvanced = useSelector(
    (state: AppState) => state.settings.advancedSettings
  );
  const { text } = useStatusSummary();
  const { authentication, isWindows } = useSelector(
    (state: AppState) => state.system.status.item
  );
  const [engine, setEngine] = useState<Engine | null>(null);
  const [failed, setFailed] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const live = useRef({
    pathname,
    showAdvanced,
    text,
    formsAuth: false,
    isWindows: false,
  });
  const formsAuth = authentication === 'forms';
  live.current = { pathname, showAdvanced, text, formsAuth, isWindows };

  // Sign-in and platform arrive with the system status, after the engine may
  // have started; the engine reads these options each time it draws.
  const optionsRef = useRef<{
    app: { plat: string };
    signOut: (() => void) | undefined;
  } | null>(null);
  const applyStatus = useCallback(() => {
    const options = optionsRef.current;

    if (!options) {
      return;
    }

    options.app.plat = live.current.isWindows ? 'Windows' : 'NAS';
    options.signOut = live.current.formsAuth
      ? () => {
          window.location.href = `${window.Sonarr.urlBase}/logout`;
        }
      : undefined;
  }, []);

  const go = useCallback(
    (to: string) => history.push(`${window.Sonarr.urlBase}${to}`),
    [history]
  );

  // Start the engine once; it stays for as long as this look is on.
  useEffect(() => {
    let mc: Engine | null = null;
    let gone = false;
    const base = `${window.Sonarr.urlBase}/Content/MC360/`;

    loadEngine(base).then(
      () => {
        if (gone || !window.MC360) {
          return;
        }

        const version = window.Sonarr.appVersion || window.Sonarr.version;

        const options = {
          base,
          app: {
            name: 'Midgar',
            plat: live.current.isWindows ? 'Windows' : 'NAS',
            ver: version,
            icon: 'tv',
          },
          blades: bladesFor(live.current.showAdvanced),
          card: () => live.current.text.split(' · ').slice(0, 3),
          onOpen: (_b: number, item: EngineItem) => {
            if (item.id !== live.current.pathname) {
              go(item.id);
            }
          },
          beforeBack: () => {
            if (live.current.pathname.startsWith('/series/')) {
              go('/');
              return true;
            }
            return false;
          },
          popupOpen: isPopupOpen,
          looks: Object.keys(LOOKS),
          setLook: (look: string) => {
            dispatch(saveUISettings({ theme: LOOKS[look] }));
          },
          checkUpdates: async () => {
            const update = await checkMidgarUpdateNow();

            if (update) {
              go('/system/updates');
              return `Version ${update.version} is ready on Updates`;
            }

            return `Midgar ${version} is the newest version`;
          },
          signOut: undefined as (() => void) | undefined,
          // Phones get the portrait layout (tab strip, big rows, full-width page).
          phone: true,
        };
        optionsRef.current = options;
        applyStatus();
        mc = window.MC360.mount(options);

        // Start on the menu of the blade the current page belongs to (the
        // look switch happens on Settings > UI); Enter opens the page.
        const { b } = locate(live.current.pathname, live.current.showAdvanced);

        mc.home(b);

        setEngine(mc);
      },
      () => setFailed(true)
    );

    return () => {
      gone = true;
      mc?.destroy();
    };
  }, [dispatch, go, applyStatus]);

  useEffect(() => {
    applyStatus();
    engine?.refresh();
  }, [engine, applyStatus, formsAuth, isWindows]);

  // The page changed (a link, the address bar, a show opened): follow it.
  const first = useRef(true);
  useEffect(() => {
    if (!engine) {
      return;
    }

    if (first.current) {
      first.current = false;
      return;
    }

    const { b, id } = locate(pathname, showAdvanced);
    engine.showPage(b, id);
  }, [engine, pathname, showAdvanced]);

  useEffect(() => {
    engine?.setBlades(bladesFor(showAdvanced));
  }, [engine, showAdvanced]);

  useEffect(() => {
    engine?.refresh();
  }, [engine, text]);

  const openShortcuts = useCallback(() => setIsShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setIsShortcutsOpen(false), []);

  // Without the engine files the pages still have to work.
  if (failed) {
    return (
      <div className={styles.fallback}>
        <div className={styles.page}>{children}</div>
      </div>
    );
  }

  return (
    <>
      {/* Keeps queue and health counts fresh. */}
      <span hidden={true}>
        <QueueStatus />
        <HealthStatus />
      </span>

      {engine
        ? createPortal(
            <>
              <div className={styles.bar}>
                <div className={styles.search}>
                  <SeriesSearchInputConnector />
                </div>

                <div className={styles.messages}>
                  <MessagesConnector />
                </div>

                <div className={styles.actions}>
                  <PageHeaderActionsMenu
                    onKeyboardShortcutsPress={openShortcuts}
                  />
                </div>
              </div>

              <div className={styles.page}>{children}</div>
            </>,
            engine.host
          )
        : null}

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onModalClose={closeShortcuts}
      />
    </>
  );
}

export default Mc360Layout;
