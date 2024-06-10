import { DateInput } from "../models";

export class DateHelpers {
  static generateDateId(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
  }

  static lastDayOfMonth(date: DateInput): Date {
    const dateWithLastDayOfMonth = new Date(date);
    dateWithLastDayOfMonth.setMonth(dateWithLastDayOfMonth.getMonth() + 1);
    dateWithLastDayOfMonth.setDate(0);

    return dateWithLastDayOfMonth;
  }

  static getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static firstMondayOfMonth(date: Date): Date {
    const firstDay = new Date(new Date(date).setDate(1));
    const monday = DateHelpers.firstDayOfWeek(firstDay);

    return monday.getMonth() === date.getMonth() ? monday : new Date(monday.setDate(monday.getDate() + 7));
  }

  static firstDayOfWeek(date: DateInput): Date {
    date = new Date(date);
    const first = date.getDate() - date.getDay() + 1;

    return new Date(new Date(date).setDate(first));
  }

  static lastDayOfWeek(date: DateInput): Date {
    date = new Date(date);
    const dayOfWeek = date.getDay();
    const diffToSunday = (dayOfWeek === 0) ? 0 : 7 - dayOfWeek;
    date.setDate(date.getDate() + diffToSunday);

    return date;
  }

  static dayBeginningTime(day: Date): Date {
    day = new Date(day);
    day.setHours(0, 0, 0, 0);

    return day;
  }

  static dayEndingTime(day: Date): Date {
    day = new Date(day);
    day.setHours(23, 59, 59, 999);

    return day;
  }
}

export enum MillisecondsToTime {
  Minute = 1000 * 60,
  Day = 86400000,
  Week = MillisecondsToTime.Day * 7
}
