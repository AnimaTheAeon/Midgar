import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import themes from 'Styles/Themes';
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
    // Midgar: the Box of X layout and shapes hang off this class.
    document.documentElement.classList.toggle('boxofx', theme === 'boxofx');
    document.documentElement.classList.toggle('blades', theme === 'blades');

    Object.entries(themes[theme] ?? themes.midgar).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [theme]);

  // On Component Mount and Component Update
  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables, theme]);

  return null;
}

export default ApplyTheme;
