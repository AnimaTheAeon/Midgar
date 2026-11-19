export default interface UiSettings {
  theme:
    | 'auto'
    | 'dark'
    | 'light'
    | 'midgar'
    | 'boxofx'
    | 'blades'
    | 'glass'
    | 'mc360';
  showRelativeDates: boolean;
  shortDateFormat: string;
  longDateFormat: string;
  timeFormat: string;
  firstDayOfWeek: number;
  enableColorImpairedMode: boolean;
  calendarWeekColumnHeader: string;
}
