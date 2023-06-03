import { IViewModeAdaptor } from "../models";

export abstract class BaseViewModeAdaptor implements IViewModeAdaptor {
  abstract getBeginningDateOfColumn(date: Date): Date;
  abstract getEndingDateOfColumn(date: Date): Date;
  abstract addColumnToDate(date: Date, columns: number): Date;
  abstract getUniqueColumnsWithinRange(date: Date, date2: Date): number;
  abstract getDurationInColumns(startDate: Date, endDate: Date): number;

  getMiddleDate(startDate: Date, endDate: Date): Date {
    const uniqueColumns = this.getUniqueColumnsWithinRange(startDate, endDate);

    return this.addColumnToDate(this.getBeginningDateOfColumn(startDate), uniqueColumns / 2);
  }
}
