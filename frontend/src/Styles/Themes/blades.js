// Midgar: "Blades" theme, glossy silver blades with the page on the open
// blade's color (shared with Lifestream, Jenova and Turks; project doc
// claude/themes/blades.md). White text and see-through glass, so pages read
// on any blade color. Same keys as the FFVII theme.
const dark = require('./dark');

const label = '#EEF2FF';
const accent = 'rgba(255, 255, 255, 0.35)';
const onAccent = '#FFFFFF';
const good = '#D9FFC4';
const warn = '#FFF0A6';
const bad = '#FFD2C8';
const well = 'rgba(0, 0, 0, 0.22)';
const borderLight = 'rgba(255, 255, 255, 0.85)';
const borderMid = 'rgba(255, 255, 255, 0.5)';
const borderDark = 'rgba(0, 0, 0, 0.2)';
const panel = 'rgba(255, 255, 255, 0.08)';
const ink = '#FFFFFF';
const inkSoft = 'rgba(255, 255, 255, 0.88)';
const inkMuted = 'rgba(255, 255, 255, 0.75)';
const glass = 'rgba(255, 255, 255, 0.16)';
const glassHover = 'rgba(255, 255, 255, 0.3)';

module.exports = {
  ...dark,

  // FFVII window pieces
  ff7Window: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04))',
  ff7BorderLight: borderLight,
  ff7BorderMid: borderMid,
  ff7BorderDark: borderDark,
  ff7FrameShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  ff7TextShadow: 'none',
  ff7Label: label,
  ff7Good: good,
  ff7Warn: warn,
  ff7Bad: bad,
  ff7Well: well,
  ff7Backdrop: '#cfcfcf',
  ff7Panel: panel,

  textColor: ink,
  defaultColor: ink,
  disabledColor: 'rgba(255, 255, 255, 0.45)',
  dimColor: inkMuted,
  offWhite: glass,
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
  themeAlternateBlue: '#ffffff',
  themeRed: bad,
  themeDarkColor: 'rgba(0, 0, 0, 0.25)',
  themeLightColor: glassHover,
  pageBackground: panel,
  pageFooterBackground: well,

  inverseLabelColor: inkSoft,
  inverseLabelTextColor: onAccent,
  disabledLabelColor: 'rgba(255, 255, 255, 0.35)',

  defaultLinkHoverColor: '#ffffff',
  linkColor: label,
  linkHoverColor: '#ffffff',

  pageHeaderBackgroundColor: 'transparent',

  sidebarColor: ink,
  sidebarBackgroundColor: 'transparent',
  sidebarActiveBackgroundColor: 'rgba(255, 255, 255, 0.2)',

  toolbarColor: ink,
  toolbarBackgroundColor: 'transparent',
  toolbarMenuItemBackgroundColor: '#3a3452',
  toolbarMenuItemHoverBackgroundColor: glassHover,
  toolbarLabelColor: label,

  borderColor: 'rgba(255, 255, 255, 0.3)',
  inputBorderColor: borderMid,
  inputBoxShadowColor: 'rgba(0, 0, 0, 0.3)',
  inputFocusBorderColor: borderLight,
  inputFocusBoxShadowColor: 'rgba(255, 255, 255, 0.35)',

  defaultButtonTextColor: ink,
  defaultBackgroundColor: glass,
  defaultBorderColor: borderMid,
  defaultHoverBackgroundColor: glassHover,
  defaultHoverBorderColor: borderLight,
  primaryBackgroundColor: 'rgba(255, 255, 255, 0.34)',
  primaryBorderColor: borderLight,
  primaryHoverBackgroundColor: 'rgba(255, 255, 255, 0.45)',
  primaryHoverBorderColor: '#ffffff',
  successBackgroundColor: 'rgba(140, 230, 120, 0.4)',
  successBorderColor: '#e6ffd8',
  successHoverBackgroundColor: 'rgba(160, 240, 140, 0.5)',
  successHoverBorderColor: '#ffffff',
  warningBackgroundColor: '#c89614',
  warningBorderColor: '#ffec8c',
  warningHoverBackgroundColor: '#dca81c',
  warningHoverBorderColor: '#ffffff',
  dangerBackgroundColor: '#b43c3c',
  dangerBorderColor: '#ffa0a0',
  dangerHoverBackgroundColor: '#c84848',
  dangerHoverBorderColor: '#ffffff',
  iconButtonDisabledColor: 'rgba(255, 255, 255, 0.35)',
  iconButtonHoverColor: label,
  iconButtonHoverLightColor: '#ffffff',

  modalBackdropBackgroundColor: 'rgba(20, 16, 32, 0.6)',
  modalBackgroundColor: '#3a3452',
  modalCloseButtonHoverColor: label,

  menuItemColor: ink,
  menuItemHoverColor: '#ffffff',
  menuItemHoverBackgroundColor: 'rgba(255, 255, 255, 0.2)',

  toobarButtonHoverColor: label,
  toobarButtonSelectedColor: accent,

  scrollbarBackgroundColor: borderMid,
  scrollbarHoverBackgroundColor: borderLight,

  cardBackgroundColor: panel,
  cardShadowColor: 'rgba(0, 0, 0, 0.4)',
  cardAlternateBackgroundColor: 'rgba(255, 255, 255, 0.05)',
  cardCenterBackgroundColor: panel,

  alertInfoBorderColor: label,
  alertInfoBackgroundColor: 'rgba(255, 255, 255, 0.12)',
  alertInfoColor: ink,
  alertSuccessBorderColor: good,
  alertSuccessBackgroundColor: 'rgba(140, 255, 110, 0.16)',
  alertSuccessColor: ink,
  alertWarningBorderColor: warn,
  alertWarningBackgroundColor: 'rgba(255, 225, 74, 0.12)',
  alertWarningColor: ink,
  alertDangerBorderColor: bad,
  alertDangerBackgroundColor: 'rgba(255, 122, 90, 0.12)',
  alertDangerColor: ink,

  sliderAccentColor: label,

  inputBackgroundColor: well,
  inputReadOnlyBackgroundColor: 'rgba(0, 0, 0, 0.3)',
  inputHoverBackgroundColor: 'rgba(0, 0, 0, 0.3)',
  inputSelectedBackgroundColor: 'rgba(255, 255, 255, 0.3)',
  advancedFormLabelColor: warn,

  popoverTitleBackgroundColor: 'rgba(60, 54, 84, 0.95)',
  popoverTitleBorderColor: borderLight,
  popoverBodyBackgroundColor: '#3a3452',
  popoverTitleBackgroundInverseColor: 'rgba(60, 54, 84, 0.95)',
  popoverTitleBorderInverseColor: borderLight,

  calendarTodayBackgroundColor: 'rgba(255, 255, 255, 0.2)',
  calendarBackgroundColor: panel,
  calendarBorderColor: 'rgba(255, 255, 255, 0.3)',
  calendarTextDim: inkSoft,
  calendarTextDimAlternate: '#ffffff',

  tableRowHoverBackgroundColor: 'rgba(255, 255, 255, 0.06)',

  addSeriesBackgroundColor: panel,
  seriesBackgroundColor: panel,
  searchIconContainerBackgroundColor: glass,
  collapseButtonBackgroundColor: glass,

  seasonBackgroundColor: panel,
  episodesBackgroundColor: 'transparent',

  progressBarFrontTextColor: onAccent,
  progressBarBackTextColor: ink,
  progressBarBackgroundColor: well,
  logEventsBackgroundColor: panel
};
