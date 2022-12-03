import { DateInput } from "./scale-generator/models";

export class DateHelpers {
  static generateDateId(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
  }

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
    date = new Date(date);
    const first = date.getDate() - date.getDay() + 6;

    return new Date(new Date(date).setDate(first));
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
}

export enum TimeInMilliseconds {
  Minute = 1000 * 60,
  Day = 86400000,
  Week = TimeInMilliseconds.Day * 7
}
