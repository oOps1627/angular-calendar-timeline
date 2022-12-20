import { DatesCacheDecorator } from '../helpers/cache';
import { DateHelpers } from "../helpers/date-helpers";
import { BaseViewModeAdaptor} from "./base-view-mode-adaptor";
import { IViewModeAdaptor } from "../models";

export class MonthsViewModeAdaptor extends BaseViewModeAdaptor implements IViewModeAdaptor {
  protected _setDateToStartOfColumn(date: Date): Date {
    const start = new Date(date);
    start.setDate(1);

    return DateHelpers.dayBeginningTime(start);
  }

  protected _setDateToEndOfColumn(date: Date): Date {
    date = new Date();
    date.setDate(DateHelpers.lastDayOfMonth(date).getDate());
    DateHelpers.dayEndingTime(date);

    return date;
  }

  @DatesCacheDecorator()
  getUniqueColumnsWithinRange(startDate: Date, endDate: Date): number {
    const diff = this._getCountOfFullMonths(startDate, endDate);

    return (diff < 0 ? 0 : diff) + 1;
  }

  @DatesCacheDecorator()
  getDurationInColumns(startDate: Date, endDate: Date): number {
    const diff = this._getCountOfFullMonths(startDate, endDate);
    const firstMonthCompletedPercent = ((startDate.getDate() - 1) + (startDate.getHours() / 24)) / DateHelpers.getDaysInMonth(startDate);
    const secondMonthCompletedPercent = ((endDate.getDate() - 1) + (endDate.getHours() / 24)) / DateHelpers.getDaysInMonth(endDate);

    return diff - firstMonthCompletedPercent + secondMonthCompletedPercent;
  }

  addColumnToDate(date: Date, months: number): Date {
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
