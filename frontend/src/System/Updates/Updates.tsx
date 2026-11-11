import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import SpinnerButton from 'Components/Link/SpinnerButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import { icons, kinds } from 'Helpers/Props';
import { fetchUpdates } from 'Store/Actions/systemActions';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import createAjaxRequest from 'Utilities/createAjaxRequest';
import formatDate from 'Utilities/Date/formatDate';
import translate from 'Utilities/String/translate';
import UpdateChanges from './UpdateChanges';
import styles from './Updates.css';

// Midgar: this page lists Midgar's own releases (from GitHub) and installs the
// newest one. On Windows the desktop app does the install; on Synology the new
// package is downloaded and installed through Package Center.

const RELEASES_URL = 'https://github.com/AnimaTheAeon/Midgar/releases';

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

  useEffect(() => {
    dispatch(fetchUpdates());
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
            Midgar couldn't reach GitHub to look for new versions. Check your
            internet connection, or look on the{' '}
            <Link to={RELEASES_URL}>Releases page</Link>.
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
                <Link to={latest.url}>Download the installer</Link> and run it;
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
              Download the new package, then open Package Center on your NAS and
              choose Manual Install. Your settings and library are kept.
            </Alert>

            <Button kind={kinds.PRIMARY} to={latest.url}>
              Download Midgar {latest.version}
            </Button>
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
