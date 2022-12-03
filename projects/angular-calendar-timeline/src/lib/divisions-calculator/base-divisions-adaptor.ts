export interface IDivisionAdaptor {
  getTimeInDivisionsCenter(startDate: Date, endDate: Date): number;

  getUniqueDivisionsCountBetweenDates(startDate: Date, endDate: Date): number;

  getDurationInDivisions(startDate: Date, endDate: Date): number;

  addDivisionToDate(date: Date, units: number): Date;
}

export abstract class BaseDivisionsAdaptor implements IDivisionAdaptor {
  protected abstract _setDateToStartOfDivision(date: Date): Date;
  protected abstract _setDateToEndOfDivision(date: Date): Date;

  abstract addDivisionToDate(date: Date, divisions: number): Date;
  abstract getUniqueDivisionsCountBetweenDates(date: Date, date2: Date): number;
  abstract getDurationInDivisions(startDate: Date, endDate: Date): number;

  getTimeInDivisionsCenter(startDate: Date, endDate: Date): number {
    const uniqueDivisions = this.getUniqueDivisionsCountBetweenDates(startDate, endDate);

    return this.addDivisionToDate(this._setDateToStartOfDivision(startDate), uniqueDivisions / 2).getTime();
  }
}
