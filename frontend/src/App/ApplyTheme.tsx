import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import themes from 'Styles/Themes';
import glassCss from 'Styles/Themes/glassCss';
import AppState from './State/AppState';

function createThemeSelector() {
  return createSelector(
    (state: AppState) => state.settings.ui.item.theme || window.Sonarr.theme,
    (theme) => {
      return theme;
    }
  );
}

function ApplyTheme() {
  const theme = useSelector(createThemeSelector());

  const updateCSSVariables = useCallback(() => {
    // Midgar: the Xbox layout and shapes hang off this class.
    document.documentElement.classList.toggle('boxofx', theme === 'boxofx');
    // MC360 pages reuse the Blades styling for buttons, dialogs and progress.
    document.documentElement.classList.toggle(
      'blades',
      theme === 'blades' || theme === 'mc360'
    );
    document.documentElement.classList.toggle('mc360', theme === 'mc360');
    document.documentElement.classList.toggle('glass', theme === 'glass');
    if (theme === 'glass' && !document.getElementById('glass-css')) {
      const style = document.createElement('style');
      style.id = 'glass-css';
      style.textContent = glassCss;
      document.head.appendChild(style);
    }

    Object.entries(themes[theme] ?? themes.midgar).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [theme]);

  // On Component Mount and Component Update
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables, theme]);

  // Dark Glass: the sidebar's selection pill glides to the open page. The
  // pill is the sidebar's ::before; this keeps its position in CSS variables.
  useEffect(() => {
    if (theme !== 'glass') {
      return undefined;
    }

    let frame = 0;
    const place = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bar = document.querySelector<HTMLElement>(
          '[class^="PageSidebar-sidebar-"], [class*=" PageSidebar-sidebar-"]'
        );
        if (!bar) {
          return;
        }
        const links = bar.querySelectorAll<HTMLElement>(
          '[class*="PageSidebarItem-isActiveLink-"]'
        );
        const cur = links[links.length - 1];
        if (!cur) {
          bar.style.setProperty('--sel-w', '0px');
          return;
        }
        const a = cur.getBoundingClientRect();
        const b = bar.getBoundingClientRect();
        bar.style.setProperty(
          '--sel-top',
          `${a.top - b.top + bar.scrollTop}px`
        );
        bar.style.setProperty('--sel-left', `${a.left - b.left}px`);
        bar.style.setProperty('--sel-w', `${a.width}px`);
        bar.style.setProperty('--sel-h', `${a.height}px`);
      });
    };
    const watch = new MutationObserver(place);
    watch.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class'],
    });
    window.addEventListener('resize', place);
    place();

    return () => {
      watch.disconnect();
      window.removeEventListener('resize', place);
      cancelAnimationFrame(frame);
    };
  }, [theme]);

  return null;
}

export default ApplyTheme;
