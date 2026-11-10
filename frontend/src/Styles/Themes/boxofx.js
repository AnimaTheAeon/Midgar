// Midgar: "Box of X" theme, a green console-dashboard look shared with Jenova
// and Lifestream (palette from the Box of X theme kit). Same keys as the FFVII
// theme; the ff7* keys colour Midgar's own windows.
const dark = require('./dark');

const label = '#C8FF4A';
const accent = '#DCFF64';
const onAccent = '#1C3504';
const good = '#8CFF6E';
const warn = '#FFE14A';
const bad = '#FF7A5A';
const well = '#000E00';
const borderLight = '#A0FF50';
const borderMid = '#50A028';
const borderDark = '#082206';
const panel = 'rgba(10, 48, 6, 0.55)';
const ink = '#E4FFC4';
const inkSoft = '#C6EEA4';
const inkMuted = '#A6DC80';

module.exports = {
  ...dark,

  // FFVII window pieces
  ff7Window: 'linear-gradient(160deg, rgba(26, 86, 12, 0.92) 0%, rgba(14, 60, 8, 0.92) 40%, rgba(10, 48, 6, 0.94) 62%, rgba(3, 22, 3, 0.96) 100%)',
  ff7BorderLight: borderLight,
  ff7BorderMid: borderMid,
  ff7BorderDark: borderDark,
  ff7FrameShadow: `0 0 0 1px ${borderDark}, inset 0 0 0 1px rgba(160, 255, 80, 0.18), 0 0 14px rgba(140, 240, 60, 0.18)`,
  ff7TextShadow: '0 0 6px rgba(150, 255, 60, 0.35)',
  ff7Label: label,
  ff7Good: good,
  ff7Warn: warn,
  ff7Bad: bad,
  ff7Well: well,
  ff7Backdrop: '#020C02',
  ff7Panel: panel,

  textColor: ink,
  defaultColor: ink,
  disabledColor: '#6E9454',
  dimColor: inkMuted,
  offWhite: '#0E3C08',
  primaryColor: label,
  selectedColor: accent,
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
  themeAlternateBlue: '#4FB51A',
  themeRed: bad,
  themeDarkColor: '#0C3406',
  themeLightColor: '#286E10',
  pageBackground: panel,
  pageFooterBackground: well,

  inverseLabelColor: inkSoft,
  inverseLabelTextColor: onAccent,
  disabledLabelColor: '#3E5A30',

  defaultLinkHoverColor: '#fff',
  linkColor: label,
  linkHoverColor: '#F0FFB0',

  pageHeaderBackgroundColor: 'transparent',

  sidebarColor: ink,
  sidebarBackgroundColor: 'transparent',
  sidebarActiveBackgroundColor: 'rgba(200, 255, 74, 0.14)',

  toolbarColor: ink,
  toolbarBackgroundColor: 'transparent',
  toolbarMenuItemBackgroundColor: '#0E3C08',
  toolbarMenuItemHoverBackgroundColor: '#286E10',
  toolbarLabelColor: label,

  borderColor: '#3C7A1E',
  inputBorderColor: borderMid,
  inputBoxShadowColor: 'rgba(0, 0, 0, 0.3)',
  inputFocusBorderColor: borderLight,
  inputFocusBoxShadowColor: 'rgba(200, 255, 74, 0.4)',

  defaultButtonTextColor: ink,
  defaultBackgroundColor: '#103C08',
  defaultBorderColor: borderMid,
  defaultHoverBackgroundColor: '#286E10',
  defaultHoverBorderColor: borderLight,
  primaryBackgroundColor: '#5FA81E',
  primaryBorderColor: borderLight,
  primaryHoverBackgroundColor: '#78C82A',
  primaryHoverBorderColor: '#F2FF9A',
  successBackgroundColor: '#2E8A14',
  successBorderColor: '#B4FF8C',
  successHoverBackgroundColor: '#3AA21A',
  successHoverBorderColor: '#fff',
  warningBackgroundColor: '#c89614',
  warningBorderColor: '#ffec8c',
  warningHoverBackgroundColor: '#dca81c',
  warningHoverBorderColor: '#fff',
  dangerBackgroundColor: '#b43c3c',
  dangerBorderColor: '#ffa0a0',
  dangerHoverBackgroundColor: '#c84848',
  dangerHoverBorderColor: '#fff',
  iconButtonDisabledColor: '#3E5A30',
  iconButtonHoverColor: label,
  iconButtonHoverLightColor: '#F0FFB0',

  modalBackdropBackgroundColor: 'rgba(2, 12, 2, 0.75)',
  modalBackgroundColor: '#0E3C08',
  modalCloseButtonHoverColor: label,

  menuItemColor: ink,
  menuItemHoverColor: '#fff',
  menuItemHoverBackgroundColor: 'rgba(200, 255, 74, 0.14)',

  toobarButtonHoverColor: label,
  toobarButtonSelectedColor: accent,

  scrollbarBackgroundColor: borderMid,
  scrollbarHoverBackgroundColor: borderLight,

  cardBackgroundColor: panel,
  cardShadowColor: 'rgba(0, 0, 0, 0.4)',
  cardAlternateBackgroundColor: 'rgba(255, 255, 255, 0.05)',
  cardCenterBackgroundColor: panel,

  alertInfoBorderColor: label,
  alertInfoBackgroundColor: 'rgba(200, 255, 74, 0.1)',
  alertInfoColor: ink,
  alertSuccessBorderColor: good,
  alertSuccessBackgroundColor: 'rgba(140, 255, 110, 0.12)',
  alertSuccessColor: ink,
  alertWarningBorderColor: warn,
  alertWarningBackgroundColor: 'rgba(255, 225, 74, 0.12)',
  alertWarningColor: ink,
  alertDangerBorderColor: bad,
  alertDangerBackgroundColor: 'rgba(255, 122, 90, 0.12)',
  alertDangerColor: ink,

  sliderAccentColor: label,

  inputBackgroundColor: well,
  inputReadOnlyBackgroundColor: '#041C04',
  inputHoverBackgroundColor: '#041C04',
  inputSelectedBackgroundColor: '#468C18',
  advancedFormLabelColor: warn,

  popoverTitleBackgroundColor: '#1E5A0C',
  popoverTitleBorderColor: borderLight,
  popoverBodyBackgroundColor: '#0E3C08',
  popoverTitleBackgroundInverseColor: '#1E5A0C',
  popoverTitleBorderInverseColor: borderLight,

  calendarTodayBackgroundColor: 'rgba(200, 255, 74, 0.14)',
  calendarBackgroundColor: panel,
  calendarBorderColor: '#3C7A1E',
  calendarTextDim: inkSoft,
  calendarTextDimAlternate: '#fff',

  tableRowHoverBackgroundColor: 'rgba(255, 255, 255, 0.06)',

  addSeriesBackgroundColor: panel,
  seriesBackgroundColor: panel,
  searchIconContainerBackgroundColor: '#103C08',
  collapseButtonBackgroundColor: '#103C08',

  seasonBackgroundColor: panel,
  episodesBackgroundColor: 'transparent',

  progressBarFrontTextColor: onAccent,
  progressBarBackTextColor: ink,
  progressBarBackgroundColor: well,
  logEventsBackgroundColor: panel
};
