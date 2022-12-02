import { ITimelineDivisionCalculator } from './models';
import { DatesCacheDecorator } from '../helpers';
import { DateHelpers } from "../date-helpers";
import { BaseDivisionsCalculator } from "./base-divisions-calculator";
import { TimeInMilliseconds } from "../models";

export class TimelineWeeksDivisionCalculator extends BaseDivisionsCalculator implements ITimelineDivisionCalculator {
  @DatesCacheDecorator()
  getUniqueDivisionsCountBetweenDates(start: Date, end: Date): number {
    const monday = DateHelpers.getFirstDayOfWeek(start);
    const last = DateHelpers.getLastDayOfWeek(end);

    return Math.round(this.getDurationInDivisions(monday, last));
  }

  @DatesCacheDecorator()
  getDurationInDivisions(startDate: Date, endDate: Date): number {
    return Math.abs((startDate.getTime() - endDate.getTime()) / TimeInMilliseconds.Week);
  }

  addDivisionToDate(date: Date, weeks: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + (7 * weeks));
    newDate.setHours(newDate.getHours() + (((weeks / 7) % 1) * 24));

    return newDate;
  }

  protected _setDateToStartOfDivision(date: Date): Date {
    const start = DateHelpers.getFirstDayOfWeek(new Date(date));

    return DateHelpers.setDayBeginningTime(start);
  }

  protected _setDateToEndOfDivision(date: Date): Date {
    const start = DateHelpers.getLastDayOfWeek(new Date(date));

    return DateHelpers.setDayEndingTime(start);
  }
}
