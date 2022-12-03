import { IScaleGroup } from "../scale-generator/models";
import { formatDate, registerLocaleData } from "@angular/common";

 import localeUk from '@angular/common/locales/uk';
// registerLocaleData(localeUk);

export interface IScaleGroupFormatter {
  transform(group: IScaleGroup): string;
}

export class DayScaleGroupFormatter implements IScaleGroupFormatter {
  transform(group: IScaleGroup): string {
    return formatDate(group.date, 'LLLL', 'en');
  }
}

export class WeekScaleGroupFormatter implements IScaleGroupFormatter {
  transform(group: IScaleGroup): string {
    return formatDate(group.date, 'LLLL y', 'en');
  }
}

export class MonthScaleGroupFormatter implements IScaleGroupFormatter {
  transform(group: IScaleGroup): string {
    return String(group.date.getFullYear());
  }
}
