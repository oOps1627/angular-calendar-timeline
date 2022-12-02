import { IDivisionAdaptor } from './models';
import { DatesCacheDecorator } from '../helpers';
import { DateHelpers } from "../date-helpers";
import { BaseDivisionsAdaptor } from "./base-divisions-adaptor";
import { TimeInMilliseconds } from "../models";

export class TimelineDaysDivisionAdaptor extends BaseDivisionsAdaptor implements IDivisionAdaptor {
  @DatesCacheDecorator()
  getUniqueDivisionsCountBetweenDates(start: Date, end: Date): number {
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    return Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / TimeInMilliseconds.Day)) + 1;
  }

  @DatesCacheDecorator()
  getDurationInDivisions(startDate: Date, endDate: Date): number {
    return Math.abs((startDate.getTime() - endDate.getTime()) / TimeInMilliseconds.Day);
  }

  addDivisionToDate(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    newDate.setHours(newDate.getHours() + ((days % 1) * 24));

    return newDate;
  }

  protected _setDateToEndOfDivision(date: Date): Date {
    return DateHelpers.setDayEndingTime(date);
  }

  protected _setDateToStartOfDivision(date: Date): Date {
    return DateHelpers.setDayBeginningTime(date);
  }
}
