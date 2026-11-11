import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import { kinds } from 'Helpers/Props';
import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
import {
  fetchDownloadClients,
  fetchIndexers,
} from 'Store/Actions/settingsActions';
import translate from 'Utilities/String/translate';
import styles from './NoSeries.css';

interface NoSeriesProps {
  totalItems: number;
}

interface StepProps {
  number: number;
  isDone: boolean;
  title: string;
  detail: string;
  to: string;
  action: string;
}

function Step({ number, isDone, title, detail, to, action }: StepProps) {
  return (
    <li className={classNames(styles.step, isDone && styles.done)}>
      <span className={styles.mark}>{isDone ? '✓' : number}</span>

      <span className={styles.stepText}>
        <span className={styles.stepTitle}>{title}</span>
        <span className={styles.stepDetail}>{detail}</span>
      </span>

      <Button to={to} kind={isDone ? kinds.DEFAULT : kinds.PRIMARY}>
        {isDone ? 'Change' : action}
      </Button>
    </li>
  );
}

// Midgar: an empty library shows the four things Midgar needs, ticking each
// off as it is set up. It goes away once the first show is added.
function GettingStarted() {
  const dispatch = useDispatch();
  const hasFolder = useSelector(
    (state: AppState) => state.rootFolders.items.length > 0
  );
  const hasClient = useSelector(
    (state: AppState) => state.settings.downloadClients.items.length > 0
  );
  const hasIndexer = useSelector(
    (state: AppState) => state.settings.indexers.items.length > 0
  );

  useEffect(() => {
    dispatch(fetchRootFolders());
    dispatch(fetchDownloadClients());
    dispatch(fetchIndexers());
  }, [dispatch]);

  return (
    <div className={styles.gettingStarted}>
      <div className={styles.heading}>Getting started</div>

      <ol className={styles.steps}>
        <Step
          number={1}
          isDone={hasFolder}
          title="Pick your TV folder"
          detail="Where your shows live. Midgar puts new episodes there."
          to="/settings/mediamanagement"
          action="Add folder"
        />
        <Step
          number={2}
          isDone={hasClient}
          title="Connect Lifestream"
          detail="Midgar hands downloads to it. Add Lifestream with its address, port 9091 and its username and password."
          to="/settings/downloadclients"
          action="Connect"
        />
        <Step
          number={3}
          isDone={hasIndexer}
          title="Add indexers"
          detail="The sites Midgar searches. Easiest: add Midgar as an app in Materia and it fills these in for you."
          to="/settings/indexers"
          action="Add"
        />
        <Step
          number={4}
          isDone={false}
          title="Add your first show"
          detail="Search for it by name and Midgar starts watching for episodes."
          to="/add/new"
          action="Add show"
        />
      </ol>

      <div className={styles.importHint}>
        Already have shows on disk? <Link to="/add/import">Import them</Link>{' '}
        instead of adding one by one.
      </div>
    </div>
  );
}

function NoSeries(props: NoSeriesProps) {
  const { totalItems } = props;

  if (totalItems > 0) {
    return (
      <div>
        <div className={styles.message}>
          {translate('AllSeriesAreHiddenByTheAppliedFilter')}
        </div>
      </div>
    );
  }

  return <GettingStarted />;
}

export default NoSeries;
