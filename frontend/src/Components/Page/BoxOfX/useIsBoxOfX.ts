import { useSelector } from 'react-redux';
import AppState from 'App/State/AppState';

export const BOX_OF_X = 'boxofx';

// True while the "Box of X" theme is chosen in Settings > UI.
export default function useIsBoxOfX() {
  return useSelector(
    (state: AppState) =>
      (state.settings.ui.item.theme || window.Sonarr.theme) === BOX_OF_X
  );
}
