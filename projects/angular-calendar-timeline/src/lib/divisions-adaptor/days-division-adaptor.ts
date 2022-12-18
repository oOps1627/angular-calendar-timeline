import { DatesCacheDecorator } from '../helpers/cache';
import { DateHelpers, MillisecondsToTime } from "../helpers/date-helpers";
import { BaseDivisionAdaptor} from "./base-division-adaptor";
import { IDivisionAdaptor } from "../models/division-adapter";

export class DaysDivisionAdaptor extends BaseDivisionAdaptor implements IDivisionAdaptor {
  @DatesCacheDecorator()
  getUniqueDivisionsCountBetweenDates(start: Date, end: Date): number {
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    return Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / MillisecondsToTime.Day)) + 1;
  }

  @DatesCacheDecorator()
  getDurationInDivisions(startDate: Date, endDate: Date): number {
    return Math.abs((startDate.getTime() - endDate.getTime()) / MillisecondsToTime.Day);
  }

  addDivisionToDate(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    newDate.setHours(newDate.getHours() + ((days % 1) * 24));

    return newDate;
  }

  protected _setDateToEndOfDivision(date: Date): Date {
    return DateHelpers.dayEndingTime(date);
  }

  protected _setDateToStartOfDivision(date: Date): Date {
    return DateHelpers.dayBeginningTime(date);
  }
}
