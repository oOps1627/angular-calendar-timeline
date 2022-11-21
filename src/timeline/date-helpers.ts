import { DateInput } from "./scale-generator/models";

export class DateHelpers {
  static getLastDayOfMonth(date: DateInput): Date {
    const dateWithLastDayOfMonth = new Date(date);
    dateWithLastDayOfMonth.setMonth(dateWithLastDayOfMonth.getMonth() + 1);
    dateWithLastDayOfMonth.setDate(0);

    return dateWithLastDayOfMonth;
  }

  static getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static getFirstMondayOfMonth(date: Date): Date {
    const firstDay = new Date(new Date(date).setDate(1));
    const monday = DateHelpers.getFirstDayOfWeek(firstDay);

    return monday.getMonth() === date.getMonth() ? monday : new Date(monday.setDate(monday.getDate() + 7));
  }

  static getFirstDayOfWeek(date: DateInput): Date {
    date = new Date(date);
    const first = date.getDate() - date.getDay() + 1;

    return new Date(new Date(date).setDate(first));
  }

  static getLastDayOfWeek(date: DateInput): Date {
    return new Date(new Date(date).setDate(DateHelpers.getFirstDayOfWeek(date).getDate() + 6))
  }

  static setDayBeginningTime(day: Date): Date {
    day = new Date(day);
    day.setHours(0, 0, 0, 0);

    return day;
  }

  static setDayEndingTime(day: Date): Date {
    day = new Date(day);
    day.setHours(24, 0, 0, 0);

    return day;
  }

  static daysToMonths(days: number): number {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
  }

  static monthsToDays(months: number): number {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
  }
}
