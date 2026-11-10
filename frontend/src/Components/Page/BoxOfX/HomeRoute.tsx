import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useIsBoxOfX from './useIsBoxOfX';

// /home is the Box of X home screen, which the page layout draws itself.
// With the FFVII menu there is no home screen, so it goes to the series list.
function HomeRoute() {
  const isBoxOfX = useIsBoxOfX();
  const history = useHistory();

  useEffect(() => {
    if (!isBoxOfX) {
      history.replace(`${window.Sonarr.urlBase}/`);
    }
  }, [isBoxOfX, history]);

  return null;
}

export default HomeRoute;
