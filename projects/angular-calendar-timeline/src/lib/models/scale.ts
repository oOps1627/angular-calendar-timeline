import { IItemsIterator } from "./items-iterator";

export interface IScaleColumn {
  id: string;

  date: Date;

  index: number;

  groups?: IScaleGroup[];
}

export interface IScaleGroup {
  id: string;

  date: Date;

  coverageInPercents: number;
}

export interface IScale {
  startDate: Date;

  endDate: Date;

  columns: IScaleColumn[];
}

export interface IScaleGeneratorConfig {
  /**
   * Text formatter for dates in the header.
   */
  formatter: IScaleFormatter;

  /**
   * Sets the first date when the scale is starting.
   */
  getStartDate?: (iterator: IItemsIterator) => Date;

  /**
   * Sets the last date in the scale.
   */
  getEndDate?: (iterator: IItemsIterator) => Date;
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
  getStartDate(itemsBuilder: IItemsIterator): Date;

  /**
   * Returns the date when the scale ends depending on the items list.
   * By default, it takes the date of the last item and adds some time for free space.
   */
  getEndDate(itemsBuilder: IItemsIterator): Date;
}
