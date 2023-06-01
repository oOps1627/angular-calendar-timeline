import { DatesCacheDecorator } from '../helpers/cache';
import { DateHelpers, MillisecondsToTime } from "../helpers/date-helpers";
import { BaseViewModeAdaptor} from "./base-view-mode-adaptor";
import { IViewModeAdaptor } from "../models";

export class DaysViewModeAdaptor extends BaseViewModeAdaptor implements IViewModeAdaptor {
  @DatesCacheDecorator()
  getUniqueColumnsWithinRange(start: Date, end: Date): number {
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    return Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / MillisecondsToTime.Day)) + 1;
  }

  @DatesCacheDecorator()
  getDurationInColumns(startDate: Date, endDate: Date): number {
    return Math.abs((startDate.getTime() - endDate.getTime()) / MillisecondsToTime.Day);
  }

  addColumnToDate(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    newDate.setHours(newDate.getHours() + ((days % 1) * 24));

    return newDate;
  }

  setDateToEndOfColumn(date: Date): Date {
    return DateHelpers.dayEndingTime(date);
  }

  setDateToStartOfColumn(date: Date): Date {
    return DateHelpers.dayBeginningTime(date);
  }
}
