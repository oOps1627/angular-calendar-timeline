import { IDivisionAdaptor } from "../models";

export abstract class BaseDivisionAdaptor implements IDivisionAdaptor {
  protected abstract _setDateToStartOfDivision(date: Date): Date;
  protected abstract _setDateToEndOfDivision(date: Date): Date;

  abstract addDivisionToDate(date: Date, divisions: number): Date;
  abstract getUniqueDivisionsCountBetweenDates(date: Date, date2: Date): number;
  abstract getDurationInDivisions(startDate: Date, endDate: Date): number;

  getMiddleDate(startDate: Date, endDate: Date): Date {
    const uniqueDivisions = this.getUniqueDivisionsCountBetweenDates(startDate, endDate);

    return this.addDivisionToDate(this._setDateToStartOfDivision(startDate), uniqueDivisions / 2);
  }
}
