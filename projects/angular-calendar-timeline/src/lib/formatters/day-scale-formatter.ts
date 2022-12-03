import { IScaleColumn, IScaleGroup } from "../scale-generator/models";
import { formatDate } from "@angular/common";
import { IScaleFormatter } from "./scale-formatter.interface";
import { Injectable, InjectionToken } from "@angular/core";

export const DAY_SCALE_FORMATTER = new InjectionToken<IScaleFormatter>('DAY_SCALE_FORMATTER');

@Injectable()
export class DayScaleFormatter implements IScaleFormatter {
  formatColumn(column: IScaleColumn, columnWidth: number, locale: string): string {
    if (columnWidth < 65)
      return formatDate(column.date, 'dd', locale);

    if (columnWidth > 180)
      return formatDate(column.date, 'EEEE dd/MM', locale);

    return formatDate(column.date, 'EEE dd/MM', locale);
  }

  formatGroup(group: IScaleGroup, locale: string): string {
    return formatDate(group.date, 'LLLL', locale);
  }
}
