import { DatesCacheDecorator } from '../helpers/cache';
import { DateHelpers, MillisecondsToTime } from "../helpers/date-helpers";
import { BaseViewModeAdaptor} from "./base-view-mode-adaptor";
import { IViewModeAdaptor } from "../models";

export class WeeksViewModeAdaptor extends BaseViewModeAdaptor implements IViewModeAdaptor {
  @DatesCacheDecorator()
  getUniqueColumnsWithinRange(start: Date, end: Date): number {
    const monday = DateHelpers.firstDayOfWeek(start);
    const last = DateHelpers.lastDayOfWeek(end);

    return Math.round(this.getDurationInColumns(monday, last));
  }

  @DatesCacheDecorator()
  getDurationInColumns(startDate: Date, endDate: Date): number {
    return Math.abs((startDate.getTime() - endDate.getTime()) / MillisecondsToTime.Week);
  }

  addColumnToDate(date: Date, weeks: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + (7 * weeks));
    newDate.setHours(newDate.getHours() + (((weeks / 7) % 1) * 24));

    return newDate;
  }

  getBeginningDateOfColumn(date: Date): Date {
    const start = DateHelpers.firstDayOfWeek(new Date(date));

    return DateHelpers.dayBeginningTime(start);
  }

  getEndingDateOfColumn(date: Date): Date {
    const end = DateHelpers.lastDayOfWeek(new Date(date));

    return DateHelpers.dayEndingTime(end);
  }
}
