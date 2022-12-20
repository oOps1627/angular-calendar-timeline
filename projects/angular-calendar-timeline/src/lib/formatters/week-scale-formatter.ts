import { IScaleColumn, IScaleFormatter, IScaleGroup } from "../models";
import { Injectable } from "@angular/core";
import { formatDate, FormStyle, getLocaleDayNames, TranslationWidth } from "@angular/common";

@Injectable()
export class WeekScaleFormatter implements IScaleFormatter {
  formatColumn(column: IScaleColumn, columnWidth: number, locale: string): string {
    if (columnWidth > 100) {
      const days = getLocaleDayNames(locale, FormStyle.Format, TranslationWidth.Abbreviated);

      return `${days[1]}-${days[0]} (${column.index})`
    }

    return String(column.index);
  }

  formatGroup(group: IScaleGroup, locale: string): string {
    return formatDate(group.date, 'LLLL y', locale);
  }
}
