import { IScaleColumn, IScaleFormatter, IScaleGroup } from "../models";
import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable()
export class MonthScaleFormatter implements IScaleFormatter {
  formatColumn(column: IScaleColumn, columnWidth: number, locale: string): string {
    if (columnWidth < 65)
      return String(column.index);

    if (columnWidth > 180)
      return formatDate(column.date, 'LLLL', locale);

    return formatDate(column.date, 'LLL', locale);
  }

  formatGroup(group: IScaleGroup, locale: string): string {
    return String(group.date.getFullYear());
  }
}
