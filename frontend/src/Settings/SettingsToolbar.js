import PropTypes from 'prop-types';
import React, { Component } from 'react';
import keyboardShortcuts, { shortcuts } from 'Components/keyboardShortcuts';
import SpinnerButton from 'Components/Link/SpinnerButton';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import { kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import AdvancedSettingsButton from './AdvancedSettingsButton';
import PendingChangesModal from './PendingChangesModal';
import styles from './SettingsToolbar.css';

class SettingsToolbar extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.bindShortcut(shortcuts.SAVE_SETTINGS.key, this.saveSettings, { isGlobal: true });
  }

  //
  // Control

  saveSettings = (event) => {
    event.preventDefault();

    const {
      hasPendingChanges,
      onSavePress
    } = this.props;

    if (hasPendingChanges) {
      onSavePress();
    }
  };

  //
  // Render

  render() {
    const {
      advancedSettings,
      showSave,
      isSaving,
      hasPendingChanges,
      hasPendingLocation,
      additionalButtons,
      onSavePress,
      onConfirmNavigation,
      onCancelNavigation,
      onAdvancedSettingsPress
    } = this.props;

    // Midgar: instead of a small greyed-out toolbar icon, a Save bar appears
    // under the toolbar as soon as something has changed.
    return (
      <>
        <PageToolbar>
          <PageToolbarSection>
            <AdvancedSettingsButton
              advancedSettings={advancedSettings}
              onAdvancedSettingsPress={onAdvancedSettingsPress}
            />

            {
              additionalButtons
            }
          </PageToolbarSection>

          <PendingChangesModal
            isOpen={hasPendingLocation}
            onConfirm={onConfirmNavigation}
            onCancel={onCancelNavigation}
          />
        </PageToolbar>

        {
          showSave && (hasPendingChanges || isSaving) ?
            <div className={styles.saveBar}>
              <span className={styles.saveText}>
                You have unsaved changes.
              </span>

              <SpinnerButton
                kind={kinds.PRIMARY}
                isSpinning={!!isSaving}
                onPress={onSavePress}
              >
                {translate('SaveChanges')}
              </SpinnerButton>
            </div> :
            null
        }
      </>
    );
  }
}

SettingsToolbar.propTypes = {
  advancedSettings: PropTypes.bool.isRequired,
  showSave: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool,
  hasPendingLocation: PropTypes.bool.isRequired,
  hasPendingChanges: PropTypes.bool,
  additionalButtons: PropTypes.node,
  onSavePress: PropTypes.func,
  onAdvancedSettingsPress: PropTypes.func.isRequired,
  onConfirmNavigation: PropTypes.func.isRequired,
  onCancelNavigation: PropTypes.func.isRequired,
  bindShortcut: PropTypes.func.isRequired
};

SettingsToolbar.defaultProps = {
  showSave: true
};

export default keyboardShortcuts(SettingsToolbar);
