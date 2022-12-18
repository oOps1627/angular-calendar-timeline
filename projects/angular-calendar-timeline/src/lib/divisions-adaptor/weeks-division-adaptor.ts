import { DatesCacheDecorator } from '../helpers/cache';
import { DateHelpers, MillisecondsToTime } from "../helpers/date-helpers";
import { BaseDivisionAdaptor} from "./base-division-adaptor";
import { IDivisionAdaptor } from "../models";

export class WeeksDivisionAdaptor extends BaseDivisionAdaptor implements IDivisionAdaptor {
  @DatesCacheDecorator()
  getUniqueDivisionsCountBetweenDates(start: Date, end: Date): number {
    const monday = DateHelpers.firstDayOfWeek(start);
    const last = DateHelpers.lastDayOfWeek(end);

    return Math.round(this.getDurationInDivisions(monday, last));
  }

  @DatesCacheDecorator()
  getDurationInDivisions(startDate: Date, endDate: Date): number {
    return Math.abs((startDate.getTime() - endDate.getTime()) / MillisecondsToTime.Week);
  }

  addDivisionToDate(date: Date, weeks: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + (7 * weeks));
    newDate.setHours(newDate.getHours() + (((weeks / 7) % 1) * 24));

    return newDate;
  }

  protected _setDateToStartOfDivision(date: Date): Date {
    const start = DateHelpers.firstDayOfWeek(new Date(date));

    return DateHelpers.dayBeginningTime(start);
  }

  protected _setDateToEndOfDivision(date: Date): Date {
    const start = DateHelpers.lastDayOfWeek(new Date(date));

    return DateHelpers.dayEndingTime(start);
  }
}
