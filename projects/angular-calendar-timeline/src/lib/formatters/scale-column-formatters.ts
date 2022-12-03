import { formatDate } from "@angular/common";
import { IScaleColumn } from "../scale-generator/models";

export interface IScaleColumnFormatter {
  transform(column: IScaleColumn, columnWidth: number, locale: string): string;
}

export class DayScaleColumnFormatter implements IScaleColumnFormatter {
  transform(column: IScaleColumn, columnWidth: number, locale: string): string {
    if (columnWidth < 65)
      return formatDate(column.date, 'dd', locale);

    if (columnWidth > 180)
      return formatDate(column.date, 'EEEE dd/MM', locale);

    return formatDate(column.date, 'EEE dd/MM', locale);
  }
}

export class WeekScaleColumnFormatter implements IScaleColumnFormatter {
  transform(column: IScaleColumn, columnWidth: number, locale: string): string {
    if (columnWidth > 100)
      return `week ${column.index}`;

    return String(column.index);
  }
}

export class MonthScaleColumnFormatter implements IScaleColumnFormatter {
  transform(column: IScaleColumn, columnWidth: number, locale: string): string {
    if (columnWidth < 65)
      return String(column.index);

    if (columnWidth > 180)
      return formatDate(column.date, 'LLLL', locale);

    return formatDate(column.date, 'LLL', locale);
  }
}
