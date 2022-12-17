import { IItemsBuilder } from "./items-builder";

export interface IScaleColumn {
  id: string;

  date: Date;

  index: number;
}

export interface IScaleGroup {
  id: string;

  columnsInGroup: number;

  date: Date;
}

export interface IScale {
  startDate: Date;

  endDate: Date;

  columns: IScaleColumn[];

  groups?: IScaleGroup[];
}

export interface IScaleFormatter {
  formatColumn(column: IScaleColumn, columnWidth: number, locale: string): string;

  formatGroup?(group: IScaleGroup, locale: string): string;
}

export interface IScaleGenerator {
  /**
   * Formatter transforms date object into text in the header of timeline
   */
  formatter: IScaleFormatter;


  /**
   * Generate the scale with start date, end date, and columns. Groups are not required.
   */
  generateScale(startDate: Date, endDate: Date): IScale;

  /**
   * Returns the date when the scale starts depending on the items list.
   * By default, it takes the date of the first item and subtracts some time for free space.
   */
  getStartDate(itemsBuilder: IItemsBuilder): Date;

  /**
   * Returns the date when the scale ends depending on the items list.
   * By default, it takes the date of the last item and adds some time for free space.
   */
  getEndDate(itemsBuilder: IItemsBuilder): Date;
}
