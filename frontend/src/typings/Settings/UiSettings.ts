export default interface UiSettings {
  theme: 'auto' | 'dark' | 'light' | 'midgar' | 'boxofx';
  showRelativeDates: boolean;
  shortDateFormat: string;
  longDateFormat: string;
  timeFormat: string;
  firstDayOfWeek: number;
  enableColorImpairedMode: boolean;
  calendarWeekColumnHeader: string;
}
