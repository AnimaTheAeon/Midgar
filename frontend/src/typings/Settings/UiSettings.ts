export default interface UiSettings {
  theme: 'auto' | 'dark' | 'light' | 'midgar' | 'boxofx' | 'blades';
  showRelativeDates: boolean;
  shortDateFormat: string;
  longDateFormat: string;
  timeFormat: string;
  firstDayOfWeek: number;
  enableColorImpairedMode: boolean;
  calendarWeekColumnHeader: string;
}
