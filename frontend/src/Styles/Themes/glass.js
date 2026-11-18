// Dark Glass (dark): frosted glass panes over a dark, softly lit backdrop,
// bright system-style colors. Shapes, blur and motion are in glassCss.js.
const midgar = require('./midgar');

const accent = '#0a84ff';
const good = '#30d158';
const warn = '#ff9f0a';
const bad = '#ff453a';
const well = 'rgba(118, 118, 128, 0.24)';
const ink = '#ffffff';
const inkSoft = 'rgba(235, 235, 245, 0.86)';
const inkMuted = 'rgba(235, 235, 245, 0.62)';
const pane = 'rgba(255, 255, 255, 0.06)';
const line = 'rgba(84, 84, 88, 0.5)';
const sheet = '#1e1e24';

module.exports = {
  ...midgar,

  ff7Window: pane,
  ff7BorderLight: 'rgba(255, 255, 255, 0.22)',
  ff7BorderMid: 'rgba(255, 255, 255, 0.12)',
  ff7BorderDark: 'rgba(0, 0, 0, 0.45)',
  ff7FrameShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.45), 0 18px 48px rgba(0, 0, 0, 0.45)',
  ff7TextShadow: 'none',
  ff7Label: inkMuted,
  ff7Good: good,
  ff7Warn: warn,
  ff7Bad: bad,
  ff7Well: well,
  ff7Backdrop: 'transparent',
  ff7Panel: 'rgba(255, 255, 255, 0.04)',

  textColor: ink,
  defaultColor: ink,
  disabledColor: 'rgba(235, 235, 245, 0.3)',
  dimColor: inkMuted,
  offWhite: sheet,
  primaryColor: accent,
  selectedColor: accent,
  successColor: good,
  dangerColor: bad,
  warningColor: warn,
  infoColor: '#64b5ff',
  sonarrBlue: accent,
  helpTextColor: inkMuted,
  darkGray: inkMuted,
  gray: inkSoft,
  lightGray: inkSoft,
  mediumGray: inkMuted,

  themeBlue: accent,
  themeAlternateBlue: '#409cff',
  themeRed: bad,
  themeDarkColor: sheet,
  themeLightColor: 'rgba(255, 255, 255, 0.16)',
  pageBackground: 'transparent',
  pageFooterBackground: well,

  inverseLabelColor: 'rgba(118, 118, 128, 0.4)',
  inverseLabelTextColor: ink,
  disabledLabelColor: 'rgba(118, 118, 128, 0.3)',

  defaultLinkHoverColor: ink,
  linkColor: '#64b5ff',
  linkHoverColor: '#99ccff',

  sidebarColor: inkSoft,
  sidebarActiveBackgroundColor: 'transparent',

  toolbarColor: ink,
  toolbarMenuItemBackgroundColor: sheet,
  toolbarMenuItemHoverBackgroundColor: 'rgba(255, 255, 255, 0.1)',
  toolbarLabelColor: inkMuted,

  borderColor: line,
  inputBorderColor: 'transparent',
  inputBoxShadowColor: 'transparent',
  inputFocusBorderColor: accent,
  inputFocusBoxShadowColor: 'rgba(10, 132, 255, 0.35)',

  defaultButtonTextColor: ink,
  defaultBackgroundColor: 'rgba(255, 255, 255, 0.1)',
  defaultBorderColor: 'transparent',
  defaultHoverBackgroundColor: 'rgba(255, 255, 255, 0.17)',
  defaultHoverBorderColor: 'transparent',
  primaryBackgroundColor: accent,
  primaryBorderColor: 'transparent',
  primaryHoverBackgroundColor: '#2a95ff',
  primaryHoverBorderColor: 'transparent',
  successBackgroundColor: '#28b44c',
  successBorderColor: 'transparent',
  successHoverBackgroundColor: good,
  successHoverBorderColor: 'transparent',
  warningBackgroundColor: '#e08a00',
  warningBorderColor: 'transparent',
  warningHoverBackgroundColor: warn,
  warningHoverBorderColor: 'transparent',
  dangerBackgroundColor: 'rgba(255, 69, 58, 0.85)',
  dangerBorderColor: 'transparent',
  dangerHoverBackgroundColor: bad,
  dangerHoverBorderColor: 'transparent',
  iconButtonDisabledColor: 'rgba(235, 235, 245, 0.3)',
  iconButtonHoverColor: ink,
  iconButtonHoverLightColor: ink,

  modalBackdropBackgroundColor: 'rgba(0, 0, 0, 0.45)',
  modalBackgroundColor: sheet,
  modalCloseButtonHoverColor: ink,

  menuItemColor: ink,
  menuItemHoverColor: ink,
  menuItemHoverBackgroundColor: 'rgba(255, 255, 255, 0.1)',

  toobarButtonHoverColor: ink,
  toobarButtonSelectedColor: accent,

  scrollbarBackgroundColor: 'rgba(255, 255, 255, 0.22)',
  scrollbarHoverBackgroundColor: 'rgba(255, 255, 255, 0.4)',

  cardBackgroundColor: pane,
  cardShadowColor: 'rgba(0, 0, 0, 0.35)',
  cardAlternateBackgroundColor: 'rgba(255, 255, 255, 0.04)',
  cardCenterBackgroundColor: pane,

  alertInfoBorderColor: 'transparent',
  alertInfoBackgroundColor: 'rgba(10, 132, 255, 0.16)',
  alertInfoColor: ink,
  alertSuccessBorderColor: 'transparent',
  alertSuccessBackgroundColor: 'rgba(48, 209, 88, 0.14)',
  alertSuccessColor: ink,
  alertWarningBorderColor: 'transparent',
  alertWarningBackgroundColor: 'rgba(255, 159, 10, 0.14)',
  alertWarningColor: ink,
  alertDangerBorderColor: 'transparent',
  alertDangerBackgroundColor: 'rgba(255, 69, 58, 0.16)',
  alertDangerColor: ink,

  sliderAccentColor: accent,

  inputBackgroundColor: well,
  checkInputBackgroundColor: 'rgba(120, 120, 128, 0.36)',
  checkInputBorderColor: 'transparent',
  checkInputTickColor: ink,
  inputReadOnlyBackgroundColor: 'rgba(118, 118, 128, 0.14)',
  inputHoverBackgroundColor: 'rgba(118, 118, 128, 0.32)',
  inputSelectedBackgroundColor: 'rgba(10, 132, 255, 0.3)',
  advancedFormLabelColor: warn,

  popoverTitleBackgroundColor: '#2a2a32',
  popoverTitleBorderColor: line,
  popoverBodyBackgroundColor: sheet,
  popoverTitleBackgroundInverseColor: '#2a2a32',
  popoverTitleBorderInverseColor: line,

  calendarTodayBackgroundColor: 'rgba(10, 132, 255, 0.16)',
  calendarBackgroundColor: 'rgba(255, 255, 255, 0.04)',
  calendarBorderColor: line,
  calendarTextDim: inkSoft,
  calendarTextDimAlternate: ink,

  tableRowHoverBackgroundColor: 'rgba(255, 255, 255, 0.05)',

  addSeriesBackgroundColor: 'rgba(255, 255, 255, 0.04)',
  seriesBackgroundColor: 'rgba(255, 255, 255, 0.04)',
  searchIconContainerBackgroundColor: well,
  collapseButtonBackgroundColor: well,

  seasonBackgroundColor: 'rgba(255, 255, 255, 0.04)',

  progressBarFrontTextColor: ink,
  progressBarBackTextColor: ink,
  progressBarBackgroundColor: well,
  logEventsBackgroundColor: 'rgba(255, 255, 255, 0.04)'
};
