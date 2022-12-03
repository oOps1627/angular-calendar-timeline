import { IScaleGroup } from "../scale-generator/models";
import { formatDate } from "@angular/common";

export interface IScaleGroupFormatter {
  transform(group: IScaleGroup, locale: string): string;
}

export class DayScaleGroupFormatter implements IScaleGroupFormatter {
  transform(group: IScaleGroup, locale: string): string {
    return formatDate(group.date, 'LLLL', locale);
  }
}

export class WeekScaleGroupFormatter implements IScaleGroupFormatter {
  transform(group: IScaleGroup, locale: string): string {
    return formatDate(group.date, 'LLLL y', locale);
  }
}

export class MonthScaleGroupFormatter implements IScaleGroupFormatter {
  transform(group: IScaleGroup, locale: string): string {
    return String(group.date.getFullYear());
  }
}
