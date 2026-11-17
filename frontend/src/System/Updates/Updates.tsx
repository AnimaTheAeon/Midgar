import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import * as commandNames from 'Commands/commandNames';
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import SpinnerButton from 'Components/Link/SpinnerButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import { icons, kinds } from 'Helpers/Props';
import { executeCommand } from 'Store/Actions/commandActions';
import { fetchUpdates } from 'Store/Actions/systemActions';
import createCommandExecutingSelector from 'Store/Selectors/createCommandExecutingSelector';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import createAjaxRequest from 'Utilities/createAjaxRequest';
import formatDate from 'Utilities/Date/formatDate';
import translate from 'Utilities/String/translate';
import UpdateChanges from './UpdateChanges';
import styles from './Updates.css';

// Midgar: this page lists Midgar's own releases and installs the newest one.
// On Windows the desktop app does the install; on Synology Midgar downloads the
// new package itself and its run script swaps it in (midgar-run.sh).

// The newest package, downloaded through Midgar itself.
function packageUrl() {
  const key = encodeURIComponent(window.Sonarr.apiKey);

  return `${window.Sonarr.urlBase}/api/v3/midgarupdate/package?apikey=${key}`;
}

type InstallState = 'idle' | 'asking' | 'started' | 'manual';

function Updates() {
  const dispatch = useDispatch();
  const currentVersion =
    window.Sonarr.appVersion || window.Sonarr.version || '';
  const isWindows = useSelector(
    (state: AppState) => state.system.status.item.isWindows
  );
  const { isFetching, isPopulated, error, items } = useSelector(
    (state: AppState) => state.system.updates
  );
  const { shortDateFormat } = useSelector(createUISettingsSelector());
  const [installState, setInstallState] = useState<InstallState>('idle');
  const isUpdating = useSelector(
    createCommandExecutingSelector(commandNames.APPLICATION_UPDATE)
  );

  useEffect(() => {
    dispatch(fetchUpdates());
  }, [dispatch]);

  const handleNasInstallPress = useCallback(() => {
    dispatch(executeCommand({ name: commandNames.APPLICATION_UPDATE }));
  }, [dispatch]);

  const handleRefreshPress = useCallback(() => {
    dispatch(fetchUpdates());
  }, [dispatch]);

  const handleInstallPress = useCallback(() => {
    setInstallState('asking');

    createAjaxRequest({
      url: '/midgarupdate/install',
      method: 'POST',
      dataType: 'json',
    }).request.then(
      (data: { started: boolean }) => {
        setInstallState(data && data.started ? 'started' : 'manual');
      },
      () => {
        setInstallState('manual');
      }
    );
  }, []);

  const latest = items.find((update) => update.latest);
  const hasUpdate = !!latest && latest.installable;
  const couldNotCheck = isPopulated && (!!error || items.length === 0);

  return (
    <PageContent title={translate('Updates')}>
      <PageContentBody>
        {isFetching && !isPopulated ? <LoadingIndicator /> : null}

        {isPopulated ? (
          <div className={styles.messageContainer}>
            <Icon
              className={hasUpdate ? styles.updateIcon : styles.upToDateIcon}
              name={hasUpdate ? icons.DOWNLOAD : icons.CHECK_CIRCLE}
              size={30}
            />

            <div className={styles.message}>
              {hasUpdate
                ? `Midgar ${latest.version} is ready. You're on ${currentVersion}.`
                : `You're on Midgar ${currentVersion}${
                    couldNotCheck ? '.' : ', the newest version.'
                  }`}
            </div>

            <SpinnerButton
              className={styles.refresh}
              isSpinning={isFetching}
              onPress={handleRefreshPress}
            >
              Check again
            </SpinnerButton>
          </div>
        ) : null}

        {couldNotCheck ? (
          <Alert kind={kinds.WARNING}>
            Midgar couldn't reach the update server to look for new versions.
            Check your internet connection and try again.
          </Alert>
        ) : null}

        {hasUpdate && isWindows ? (
          <div className={styles.install}>
            {installState === 'started' ? (
              <Alert kind={kinds.INFO}>
                Downloading Midgar {latest.version}. Midgar will close, update
                and open again by itself.
              </Alert>
            ) : null}

            {installState === 'manual' ? (
              <Alert kind={kinds.WARNING}>
                The Midgar desktop app isn't running here, so it can't install
                the update for you.{' '}
                <a href={packageUrl()}>Download the installer</a> and run it;
                your settings and library are kept.
              </Alert>
            ) : null}

            {installState === 'idle' || installState === 'asking' ? (
              <SpinnerButton
                kind={kinds.PRIMARY}
                isSpinning={installState === 'asking'}
                onPress={handleInstallPress}
              >
                Install Midgar {latest.version}
              </SpinnerButton>
            ) : null}
          </div>
        ) : null}

        {hasUpdate && !isWindows ? (
          <div className={styles.install}>
            <Alert kind={kinds.INFO}>
              Midgar downloads the new version, checks it and restarts by
              itself. Your settings and library are kept.
            </Alert>

            <SpinnerButton
              kind={kinds.PRIMARY}
              isSpinning={isUpdating}
              onPress={handleNasInstallPress}
            >
              Install Midgar {latest.version}
            </SpinnerButton>
          </div>
        ) : null}

        {isPopulated && items.length > 0 ? (
          <div>
            {items.map((update) => {
              const changes = update.changes;
              const hasChanges =
                !!changes && changes.new.length + changes.fixed.length > 0;

              return (
                <div key={update.version} className={styles.update}>
                  <div className={styles.info}>
                    <div className={styles.version}>
                      Midgar {update.version}
                    </div>
                    <div className={styles.space}>&mdash;</div>
                    <div className={styles.date}>
                      {formatDate(update.releaseDate, shortDateFormat)}
                    </div>

                    {update.installed ? (
                      <Label className={styles.label} kind={kinds.SUCCESS}>
                        Installed
                      </Label>
                    ) : null}

                    {update.latest && update.installable ? (
                      <Label className={styles.label} kind={kinds.INFO}>
                        New
                      </Label>
                    ) : null}
                  </div>

                  {hasChanges && changes ? (
                    <div>
                      <UpdateChanges
                        title={translate('New')}
                        changes={changes.new}
                      />
                      <UpdateChanges
                        title={translate('Fixed')}
                        changes={changes.fixed}
                      />
                    </div>
                  ) : (
                    <div className={styles.noNotes}>
                      No notes for this version.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </PageContentBody>
    </PageContent>
  );
}

export default Updates;
