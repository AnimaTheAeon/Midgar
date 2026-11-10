// Midgar: FFVII party-menu theme (matches Lifestream and Jenova).
// Starts from the dark theme and overrides colours; the ff7* keys are used
// directly by Midgar's own window chrome.
const dark = require('./dark');

const label = '#70ccff';
const good = '#78e68c';
const warn = '#ffe260';
const bad = '#ff6e6e';
const well = '#080c34';
const borderLight = '#d6d8e4';
const borderMid = '#8c90a8';
const borderDark = '#2c2e46';
const panel = 'rgba(8, 12, 52, 0.55)';
const ink = '#f4f4f8';
const inkSoft = '#d6d8e4';
const inkMuted = '#aab2d6';

module.exports = {
  ...dark,

  // FFVII window pieces
  ff7Window: 'linear-gradient(160deg, #2e56be 0%, #1a2c96 40%, #121e78 62%, #06083a 100%)',
  ff7BorderLight: borderLight,
  ff7BorderMid: borderMid,
  ff7BorderDark: borderDark,
  ff7FrameShadow: `0 0 0 1px ${borderDark}, inset 0 0 0 1px ${borderMid}, 0 6px 14px rgba(0, 0, 0, 0.6)`,
  ff7TextShadow: '2px 2px 0 rgba(0, 0, 0, 0.85)',
  ff7Label: label,
  ff7Good: good,
  ff7Warn: warn,
  ff7Bad: bad,
  ff7Well: well,
  ff7Backdrop: '#04040c',
  ff7Panel: panel,

  textColor: ink,
  defaultColor: ink,
  disabledColor: '#8088b8',
  dimColor: inkMuted,
  offWhite: '#121e78',
  primaryColor: label,
  selectedColor: warn,
  successColor: good,
  dangerColor: bad,
  warningColor: warn,
  infoColor: label,
  sonarrBlue: label,
  helpTextColor: inkMuted,
  darkGray: inkMuted,
  gray: inkSoft,
  lightGray: inkSoft,
  mediumGray: inkMuted,

  themeBlue: label,
  themeAlternateBlue: '#3c70d2',
  themeRed: bad,
  themeDarkColor: '#101a5c',
  themeLightColor: '#2c48aa',
  pageBackground: panel,
  pageFooterBackground: well,

  inverseLabelColor: inkSoft,
  inverseLabelTextColor: '#101a5c',
  disabledLabelColor: '#5a5e78',

  defaultLinkHoverColor: '#fff',
  linkColor: label,
  linkHoverColor: '#b4e6ff',

  pageHeaderBackgroundColor: 'transparent',

  sidebarColor: ink,
  sidebarBackgroundColor: 'transparent',
  sidebarActiveBackgroundColor: 'rgba(112, 204, 255, 0.14)',

  toolbarColor: ink,
  toolbarBackgroundColor: 'transparent',
  toolbarMenuItemBackgroundColor: '#121e78',
  toolbarMenuItemHoverBackgroundColor: '#2c48aa',
  toolbarLabelColor: label,

  borderColor: '#5a64a0',
  inputBorderColor: '#5a64a0',
  inputBoxShadowColor: 'rgba(0, 0, 0, 0.3)',
  inputFocusBorderColor: borderLight,
  inputFocusBoxShadowColor: 'rgba(112, 204, 255, 0.4)',

  defaultButtonTextColor: ink,
  defaultBackgroundColor: '#101a5c',
  defaultBorderColor: borderMid,
  defaultHoverBackgroundColor: '#2c48aa',
  defaultHoverBorderColor: borderLight,
  primaryBackgroundColor: '#3c64c8',
  primaryBorderColor: borderLight,
  primaryHoverBackgroundColor: '#4a78e0',
  primaryHoverBorderColor: '#fff',
  successBackgroundColor: '#1e9a46',
  successBorderColor: '#a0f0b0',
  successHoverBackgroundColor: '#22b052',
  successHoverBorderColor: '#fff',
  warningBackgroundColor: '#c89614',
  warningBorderColor: '#ffec8c',
  warningHoverBackgroundColor: '#dca81c',
  warningHoverBorderColor: '#fff',
  dangerBackgroundColor: '#b43c3c',
  dangerBorderColor: '#ffa0a0',
  dangerHoverBackgroundColor: '#c84848',
  dangerHoverBorderColor: '#fff',
  iconButtonDisabledColor: '#5a5e78',
  iconButtonHoverColor: label,
  iconButtonHoverLightColor: '#b4e6ff',

  modalBackdropBackgroundColor: 'rgba(4, 4, 12, 0.7)',
  modalBackgroundColor: '#121e78',
  modalCloseButtonHoverColor: label,

  menuItemColor: ink,
  menuItemHoverColor: '#fff',
  menuItemHoverBackgroundColor: 'rgba(255, 255, 255, 0.1)',

  toobarButtonHoverColor: label,
  toobarButtonSelectedColor: warn,

  scrollbarBackgroundColor: borderMid,
  scrollbarHoverBackgroundColor: borderLight,

  cardBackgroundColor: panel,
  cardShadowColor: 'rgba(0, 0, 0, 0.4)',
  cardAlternateBackgroundColor: 'rgba(255, 255, 255, 0.05)',
  cardCenterBackgroundColor: panel,

  alertInfoBorderColor: label,
  alertInfoBackgroundColor: 'rgba(112, 204, 255, 0.12)',
  alertInfoColor: ink,
  alertSuccessBorderColor: good,
  alertSuccessBackgroundColor: 'rgba(120, 230, 140, 0.12)',
  alertSuccessColor: ink,
  alertWarningBorderColor: warn,
  alertWarningBackgroundColor: 'rgba(255, 226, 96, 0.12)',
  alertWarningColor: ink,
  alertDangerBorderColor: bad,
  alertDangerBackgroundColor: 'rgba(255, 110, 110, 0.12)',
  alertDangerColor: ink,

  sliderAccentColor: label,

  inputBackgroundColor: well,
  inputReadOnlyBackgroundColor: '#0c1244',
  inputHoverBackgroundColor: '#0c1244',
  inputSelectedBackgroundColor: '#2c48aa',
  advancedFormLabelColor: warn,

  popoverTitleBackgroundColor: '#1a2c96',
  popoverTitleBorderColor: borderLight,
  popoverBodyBackgroundColor: '#121e78',
  popoverTitleBackgroundInverseColor: '#1a2c96',
  popoverTitleBorderInverseColor: borderLight,

  calendarTodayBackgroundColor: 'rgba(112, 204, 255, 0.14)',
  calendarBackgroundColor: panel,
  calendarBorderColor: '#5a64a0',
  calendarTextDim: inkSoft,
  calendarTextDimAlternate: '#fff',

  tableRowHoverBackgroundColor: 'rgba(255, 255, 255, 0.06)',

  addSeriesBackgroundColor: panel,
  seriesBackgroundColor: panel,
  searchIconContainerBackgroundColor: '#101a5c',
  collapseButtonBackgroundColor: '#101a5c',

  seasonBackgroundColor: panel,
  episodesBackgroundColor: 'transparent',

  progressBarFrontTextColor: '#fff',
  progressBarBackTextColor: ink,
  progressBarBackgroundColor: well,
  logEventsBackgroundColor: panel
};
