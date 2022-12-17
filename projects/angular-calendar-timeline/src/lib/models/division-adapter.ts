/**
 * 'Division' is the minimal unit of measurement of current zoom.
 *  It can be 'Month', 'Week', 'Day' or your custom.
 *  DivisionAdapter performs calculations between dates.
 *  Adapters have different strategies depending on what unit of measurement they are connected to.
 */
export interface IDivisionAdaptor {
  /**
   * Transforms duration between dates into columns and returns date which placed in the center of the columns.
   * Example:
   *    When division == Months:
   *     1) firstDate = 01.02.2023, lastDate = 02.02.2023, result = 14.02.2023 (Middle date in February);
   *     2) firstDate = 10.01.2023, lastDate = 10.03.2023, result = 01.02.2023 (Middle date between 3 months);
   *    When division == Days:
   *     1) firstDate = 01.02.2023, lastDate = 02.02.2023, result = starting of 02.02.2023 or ending of 01.02.2023.
   *     2) firstDate = 01.02.2023, lastDate = 05.02.2023, result = 03.02.2023.
   */
  getMiddleDate(startDate: Date, endDate: Date): Date;

  /**
   *  Returns the unique count of columns with includes two dates between them.
   *  Result should be always integer.
   */
  getUniqueDivisionsCountBetweenDates(startDate: Date, endDate: Date): number;

  /**
   * Returns the duration between dates which is transformed into a number of columns.
   */
  getDurationInDivisions(startDate: Date, endDate: Date): number;

  /**
   * Adds one unit of measurement to date.
   */
  addDivisionToDate(date: Date, units: number): Date;
}
