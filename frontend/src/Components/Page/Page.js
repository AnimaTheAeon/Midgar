import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AppUpdatedModal from 'App/AppUpdatedModal';
import ColorImpairedContext from 'App/ColorImpairedContext';
import ConnectionLostModal from 'App/ConnectionLostModal';
import SignalRConnector from 'Components/SignalRConnector';
import AuthenticationRequiredModal from 'FirstRun/AuthenticationRequiredModal';
import locationShape from 'Helpers/Props/Shapes/locationShape';
import BladesLayout from './Blades/BladesLayout';
import BoxOfXLayout from './BoxOfX/BoxOfXLayout';
import PageHeader from './Header/PageHeader';
import StatusLine from './Midgar/StatusLine';
import { useMidgarPolling } from './Midgar/useMidgarStatus';
import PageSidebar from './Sidebar/PageSidebar';
import styles from './Page.css';

// Midgar: the status line owns the shared polling (disk space, tasks, missing count).
function MidgarStatusLine() {
  useMidgarPolling();

  return <StatusLine />;
}

class Page extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isUpdatedModalOpen: false,
      isConnectionLostModalOpen: false,
      // Midgar: the sign-in window can be put off until next launch.
      isAuthenticationModalDismissed: false
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentDidUpdate(prevProps) {
    const {
      isDisconnected,
      isUpdated
    } = this.props;

    if (!prevProps.isUpdated && isUpdated) {
      this.setState({ isUpdatedModalOpen: true });
    }

    if (prevProps.isDisconnected !== isDisconnected) {
      this.setState({ isConnectionLostModalOpen: isDisconnected });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  //
  // Listeners

  onResize = () => {
    this.props.onResize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  onUpdatedModalClose = () => {
    this.setState({ isUpdatedModalOpen: false });
  };

  onAuthenticationModalClose = () => {
    this.setState({ isAuthenticationModalDismissed: true });
  };

  onConnectionLostModalClose = () => {
    this.setState({ isConnectionLostModalOpen: false });
  };

  //
  // Render

  render() {
    const {
      className,
      location,
      children,
      isSmallScreen,
      isSidebarVisible,
      enableColorImpairedMode,
      authenticationEnabled,
      isBoxOfX,
      isBlades,
      onSidebarToggle,
      onSidebarVisibleChange
    } = this.props;

    const modals = (
      <React.Fragment>
        <AppUpdatedModal
          isOpen={this.state.isUpdatedModalOpen}
          onModalClose={this.onUpdatedModalClose}
        />

        <ConnectionLostModal
          isOpen={this.state.isConnectionLostModalOpen}
          onModalClose={this.onConnectionLostModalClose}
        />

        <AuthenticationRequiredModal
          isOpen={!authenticationEnabled && !this.state.isAuthenticationModalDismissed}
          onModalClose={this.onAuthenticationModalClose}
        />
      </React.Fragment>
    );

    // Midgar: the Blades theme puts each page on the open blade.
    if (isBlades) {
      return (
        <ColorImpairedContext.Provider value={enableColorImpairedMode}>
          <SignalRConnector />

          <BladesLayout location={location}>
            {children}
          </BladesLayout>

          {modals}
        </ColorImpairedContext.Provider>
      );
    }

    // Midgar: the Box of X theme has its own home screen and page layout.
    if (isBoxOfX) {
      return (
        <ColorImpairedContext.Provider value={enableColorImpairedMode}>
          <SignalRConnector />

          <BoxOfXLayout location={location}>
            {children}
          </BoxOfXLayout>

          {modals}
        </ColorImpairedContext.Provider>
      );
    }

    return (
      <ColorImpairedContext.Provider value={enableColorImpairedMode}>
        <div className={className}>
          <SignalRConnector />

          <PageHeader
            onSidebarToggle={onSidebarToggle}
          />

          <div className={styles.main}>
            <PageSidebar
              location={location}
              isSmallScreen={isSmallScreen}
              isSidebarVisible={isSidebarVisible}
              onSidebarVisibleChange={onSidebarVisibleChange}
            />

            {children}
          </div>

          <MidgarStatusLine />

          {modals}
        </div>
      </ColorImpairedContext.Provider>
    );
  }
}

Page.propTypes = {
  className: PropTypes.string,
  location: locationShape.isRequired,
  children: PropTypes.node.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired,
  isUpdated: PropTypes.bool.isRequired,
  isDisconnected: PropTypes.bool.isRequired,
  enableColorImpairedMode: PropTypes.bool.isRequired,
  authenticationEnabled: PropTypes.bool.isRequired,
  isBoxOfX: PropTypes.bool.isRequired,
  isBlades: PropTypes.bool,
  onResize: PropTypes.func.isRequired,
  onSidebarToggle: PropTypes.func.isRequired,
  onSidebarVisibleChange: PropTypes.func.isRequired
};

Page.defaultProps = {
  className: styles.page
};

export default Page;
