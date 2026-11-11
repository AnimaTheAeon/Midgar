import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import QueueStatus from 'Activity/Queue/Status/QueueStatus';
import AppState from 'App/State/AppState';
import Link from 'Components/Link/Link';
import KeyboardShortcutsModal from 'Components/Page/Header/KeyboardShortcutsModal';
import PageHeaderActionsMenu from 'Components/Page/Header/PageHeaderActionsMenu';
import SeriesSearchInputConnector from 'Components/Page/Header/SeriesSearchInputConnector';
import { useStatusSummary } from 'Components/Page/Midgar/StatusLine';
import MessagesConnector from 'Components/Page/Sidebar/Messages/MessagesConnector';
import { getActiveParent, links } from 'Components/Page/Sidebar/PageSidebar';
import { toggleAdvancedSettings } from 'Store/Actions/settingsActions';
import HealthStatus from 'System/Status/Health/HealthStatus';
import Orb from './Orb';
import { sinkIntoGlow, zoomIntoOrb, zoomOutOfOrb } from './orbZoom';
import styles from './BoxOfX.css';

// Midgar: the "Box of X" layout. A home screen with the big orb and the menu
// on an arc; every page opens in one big panel under a slanted title bar, with
// its sub-pages as tabs. BACK, Esc and the mouse's back button return home.

interface NavLink {
  title: () => string;
  to: string;
  alias?: string;
  isAdvanced?: boolean;
  children?: NavLink[];
  statusComponent?: React.ElementType;
  exact?: boolean;
}

export const HOME = '/home';

const sections = links as NavLink[];

// Remembers which menu entry the home cursor sits on, so BACK lands on the
// page just left.
let homeCursor = 0;
let hasStarted = false;

function stripUrlBase(pathname: string) {
  const urlBase = window.Sonarr.urlBase;

  return urlBase ? pathname.substr(urlBase.length) || '/' : pathname;
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;

  if (!el || !el.tagName) {
    return false;
  }

  return (
    el.isContentEditable ||
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT'
  );
}

function isPopupOpen() {
  // Dialogs, open menus and tooltips render under #portal-root. Closed menus
  // and tooltips leave empty or zero-size holders there, so look for
  // something that actually takes up space on screen.
  const portal = document.getElementById('portal-root');

  if (!portal) {
    return false;
  }

  return Array.from(portal.querySelectorAll('*')).some((element) => {
    const rect = element.getBoundingClientRect();

    return rect.width > 24 && rect.height > 24;
  });
}

function sectionTabs(
  section: NavLink,
  showAdvanced: boolean,
  pathname: string
) {
  // Advanced pages only show with Show Advanced on, except the one you're on,
  // so the tab row always marks where you are.
  const children = (section.children ?? []).filter(
    (child) => showAdvanced || !child.isAdvanced || isTabActive(child, pathname)
  );

  if (children.some((child) => child.to === section.to)) {
    return children;
  }

  return [
    { title: section.title, to: section.to, alias: section.alias },
    ...children,
  ];
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

function sectionStatus(section: NavLink) {
  return section.children?.find((child) => !!child.statusComponent)
    ?.statusComponent;
}

interface HintProps {
  keyName: string;
  label: string;
  onPress: () => void;
}

function Hint({ keyName, label, onPress }: HintProps) {
  return (
    <div className={styles.hint}>
      <button className={styles.hintKey} type="button" onClick={onPress}>
        {keyName}
      </button>
      <span>{label}</span>
    </div>
  );
}

interface StatusBoxProps {
  isHome: boolean;
}

function StatusBox({ isHome }: StatusBoxProps) {
  const { status, text, update } = useStatusSummary();

  return (
    <div
      className={classNames(styles.statusBox, isHome && styles.statusBoxHome)}
    >
      <Link
        className={styles.statusLink}
        to="/system/status"
        title="System status"
      >
        <span className={classNames(styles.miniOrb, styles[status.kind])} />

        <span className={styles.statusLines}>
          <span className={styles.statusTop}>{status.title}</span>
          <span
            className={classNames(
              styles.statusBottom,
              status.kind === 'warn' && styles.warnText,
              status.kind === 'bad' && styles.badText
            )}
          >
            {text}
          </span>
        </span>
      </Link>

      {update ? (
        <Link
          className={styles.updateChip}
          to="/system/updates"
          title="Open the Updates page to install it."
        >
          UPDATE {update.version} READY
        </Link>
      ) : null}
    </div>
  );
}

function Backdrop({ isHome }: { isHome: boolean }) {
  const cx = isHome ? 420 : 120;
  const cy = isHome ? 380 : 90;

  return (
    <div
      className={classNames(
        styles.backdrop,
        isHome ? styles.backdropHome : styles.backdropPage
      )}
    >
      <svg
        className={styles.grid}
        viewBox="0 0 1280 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden={true}
      >
        <g fill="none" stroke="rgba(120,220,60,0.13)" strokeWidth="1.4">
          {[
            [300, 280],
            [470, 430],
            [660, 600],
            [880, 790],
          ].map(([rx, ry]) => (
            <ellipse key={rx} cx={cx} cy={cy} rx={rx} ry={ry} />
          ))}
          {[
            [-200, -300],
            [cx, -400],
            [1100, -300],
            [1600, 250],
            [1500, 1100],
            [cx, 1200],
            [-400, 1100],
            [-500, cy],
          ].map(([x2, y2]) => (
            <line key={`${x2}:${y2}`} x1={cx} y1={cy} x2={x2} y2={y2} />
          ))}
        </g>
      </svg>
    </div>
  );
}

interface MenuItemProps {
  section: NavLink;
  index: number;
  indent: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
}

function MenuItem({
  section,
  index,
  indent,
  isSelected,
  onSelect,
}: MenuItemProps) {
  const Status = sectionStatus(section);
  const select = useCallback(() => onSelect(index), [index, onSelect]);

  return (
    <Link
      className={classNames(styles.menuItem, isSelected && styles.selected)}
      style={{ marginLeft: indent }}
      to={section.to}
      onMouseEnter={select}
      onFocus={select}
      onPress={select}
    >
      <span className={styles.node} />
      <span className={styles.wire} />
      <span className={styles.menuTab}>
        <span className={styles.menuTabInner} />
        <span className={styles.menuLabel}>{section.title()}</span>
        {Status ? (
          <span className={styles.menuStatus}>
            <Status />
          </span>
        ) : null}
      </span>
    </Link>
  );
}

// Simple shows the settings most people need; Advanced shows everything.
function ModeHint() {
  const dispatch = useDispatch();
  const advanced = useSelector(
    (state: AppState) => state.settings.advancedSettings
  );
  const toggle = useCallback(() => {
    dispatch(toggleAdvancedSettings());
  }, [dispatch]);

  return (
    <button
      className={styles.modeHint}
      type="button"
      title="Simple shows the settings most people need. Advanced shows everything."
      onClick={toggle}
    >
      MODE: {advanced ? 'ADVANCED' : 'SIMPLE'}
    </button>
  );
}

interface HomeProps {
  onOpen: (to: string) => void;
}

function Home({ onOpen }: HomeProps) {
  const [cursor, setCursor] = useState(homeCursor);

  const move = useCallback((index: number) => {
    homeCursor = index;
    setCursor(index);
  }, []);

  const open = useCallback(
    (index: number) => {
      homeCursor = index;
      onOpen(sections[index].to);
    },
    [onOpen]
  );

  const openCurrent = useCallback(() => open(homeCursor), [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isTyping(event.target) || isPopupOpen()) {
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        move((homeCursor + step + sections.length) % sections.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        open(homeCursor);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move, open]);

  // The menu bows around the orb: each node sits on a circle centred on it.
  const radius = 300;
  const spacing = 70;
  const middle = (sections.length - 1) / 2;
  const edge = Math.sqrt(radius * radius - (middle * spacing) ** 2);

  return (
    <div className={styles.home}>
      <div className={styles.homeMain}>
        <Orb />

        <nav className={styles.menu} aria-label="Main menu">
          {sections.map((section, index) => {
            const dy = (index - middle) * spacing;

            return (
              <MenuItem
                key={section.to}
                section={section}
                index={index}
                indent={Math.round(Math.sqrt(radius * radius - dy * dy) - edge)}
                isSelected={cursor === index}
                onSelect={move}
              />
            );
          })}
        </nav>
      </div>

      <div className={styles.bottomRow}>
        <StatusBox isHome={true} />
        <div className={styles.hints}>
          <ModeHint />
          <Hint keyName="ENTER" label="SELECT" onPress={openCurrent} />
        </div>
      </div>
    </div>
  );
}

interface BoxOfXLayoutProps {
  location: { pathname: string };
  children: React.ReactNode;
}

function BoxOfXLayout({ location, children }: BoxOfXLayoutProps) {
  const history = useHistory();
  const pathname = stripUrlBase(location.pathname);
  const isHome = pathname === HOME;
  const showAdvanced = useSelector(
    (state: AppState) => state.settings.advancedSettings
  );
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const go = useCallback(
    (to: string) => history.push(`${window.Sonarr.urlBase}${to}`),
    [history]
  );

  // From home, zoom into the orb first; BACK sinks the page into the glow,
  // then the orb shrinks back on the home screen.
  const openFromHome = useCallback(
    (to: string) => zoomIntoOrb(() => go(to)),
    [go]
  );
  const goHome = useCallback(() => sinkIntoGlow(() => go(HOME)), [go]);

  // BACK steps out one level, like Turks: a show's page goes to the series
  // list first, everything else goes home.
  const isSeriesDetails = pathname.startsWith('/series/');
  const goBack = useCallback(() => {
    if (isSeriesDetails) {
      go('/');
    } else {
      goHome();
    }
  }, [isSeriesDetails, go, goHome]);

  useEffect(() => {
    if (isHome) {
      zoomOutOfOrb();
    }
  }, [isHome]);
  const openShortcuts = useCallback(() => setIsShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setIsShortcutsOpen(false), []);

  // Starting Midgar on the series list opens the home screen instead.
  useEffect(() => {
    if (!hasStarted) {
      hasStarted = true;

      if (pathname === '/') {
        history.replace(`${window.Sonarr.urlBase}${HOME}`);
      }
    }
  }, [pathname, history]);

  const activeTo = getActiveParent(pathname);
  const sectionIndex = Math.max(
    0,
    sections.findIndex((section) => section.to === activeTo)
  );
  const section = sections[sectionIndex];

  useEffect(() => {
    if (!isHome) {
      homeCursor = sectionIndex;
    }
  }, [isHome, sectionIndex]);

  // Esc (when not typing and no pop-up is open) and the mouse's back button
  // step back one level.
  useEffect(() => {
    if (isHome) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        isTyping(event.target) ||
        isPopupOpen()
      ) {
        return;
      }

      goBack();
    };

    const onMouseUp = (event: MouseEvent) => {
      if (event.button !== 3) {
        return;
      }

      event.preventDefault();

      if (!isPopupOpen()) {
        goBack();
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 3) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, [isHome, goBack]);

  const tabs = sectionTabs(section, showAdvanced, pathname);

  return (
    <div className={styles.layout}>
      <Backdrop isHome={isHome} />

      {/* Keeps queue and health counts fresh (the FFVII menu does this itself). */}
      <span hidden={true}>
        <QueueStatus />
        <HealthStatus />
      </span>

      {isHome ? (
        <Home onOpen={openFromHome} />
      ) : (
        <div className={styles.pageScreen}>
          <div className={styles.topRow}>
            <div className={styles.titleBar}>
              <span>{section.title()}</span>
            </div>

            <div className={styles.search}>
              <SeriesSearchInputConnector />
            </div>

            <StatusBox isHome={false} />

            <div className={styles.actions}>
              <PageHeaderActionsMenu onKeyboardShortcutsPress={openShortcuts} />
            </div>
          </div>

          {tabs.length > 1 ? (
            <nav className={styles.tabs} aria-label={section.title()}>
              {tabs.map((tab) => {
                const Status = tab.statusComponent;

                return (
                  <Link
                    key={tab.to}
                    className={classNames(
                      styles.tab,
                      isTabActive(tab, pathname) && styles.tabSelected
                    )}
                    to={tab.to}
                  >
                    <span>{tab.title()}</span>
                    {Status ? <Status /> : null}
                  </Link>
                );
              })}
            </nav>
          ) : null}

          <div className={styles.frameGlow}>
            <div className={styles.frame}>
              <div className={styles.frameInner}>{children}</div>
            </div>
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.messages}>
              <MessagesConnector />
            </div>

            <Hint
              keyName="ESC"
              label={isSeriesDetails ? 'SERIES' : 'BACK'}
              onPress={goBack}
            />
          </div>
        </div>
      )}

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onModalClose={closeShortcuts}
      />
    </div>
  );
}

export default BoxOfXLayout;
