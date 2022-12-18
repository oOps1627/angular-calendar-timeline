import { DatesCacheDecorator } from '../helpers/cache';
import { DateHelpers } from "../helpers/date-helpers";
import { BaseDivisionAdaptor} from "./base-division-adaptor";
import { IDivisionAdaptor } from "../models/division-adapter";

export class MonthsDivisionAdaptor extends BaseDivisionAdaptor implements IDivisionAdaptor {
  protected _setDateToStartOfDivision(date: Date): Date {
    const start = new Date(date);
    start.setDate(1);

    return DateHelpers.dayBeginningTime(start);
  }

  protected _setDateToEndOfDivision(date: Date): Date {
    date = new Date();
    date.setDate(DateHelpers.lastDayOfMonth(date).getDate());
    DateHelpers.dayEndingTime(date);

    return date;
  }

  @DatesCacheDecorator()
  getUniqueDivisionsCountBetweenDates(startDate: Date, endDate: Date): number {
    const diff = this._getCountOfFullMonths(startDate, endDate);

    return (diff < 0 ? 0 : diff) + 1;
  }

  @DatesCacheDecorator()
  getDurationInDivisions(startDate: Date, endDate: Date): number {
    const diff = this._getCountOfFullMonths(startDate, endDate);
    const firstMonthCompletedPercent = ((startDate.getDate() - 1) + (startDate.getHours() / 24)) / DateHelpers.getDaysInMonth(startDate);
    const secondMonthCompletedPercent = ((endDate.getDate() - 1) + (endDate.getHours() / 24)) / DateHelpers.getDaysInMonth(endDate);

    return diff - firstMonthCompletedPercent + secondMonthCompletedPercent;
  }

  addDivisionToDate(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + months);
    const days = DateHelpers.getDaysInMonth(newDate) * (months % 1);
    newDate.setDate(newDate.getDate() + days);
    newDate.setHours(newDate.getHours() + ((days % 1) * 24));

    return newDate;
  }

  private _getCountOfFullMonths(startDate: Date, endDate: Date): number {
    const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth() + (12 * yearsDiff);

    return endMonth - startMonth;
  }
}
