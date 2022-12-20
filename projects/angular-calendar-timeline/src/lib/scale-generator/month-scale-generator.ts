import { BaseScaleGenerator } from './base-scale-generator';
import { DateInput, IScaleGenerator, IScaleGeneratorConfig, IScaleGroup } from '../models';
import { DateHelpers } from "../helpers/date-helpers";
import { Injectable, InjectionToken } from "@angular/core";
import { MonthScaleFormatter } from "../formatters/month-scale-formatter";

export const MONTH_SCALE_GENERATOR_CONFIG = new InjectionToken<IScaleGeneratorConfig>('Month scale config');

const DefaultConfig: IScaleGeneratorConfig = {
  formatter: new MonthScaleFormatter(),
}

@Injectable()
export class DefaultMonthScaleGenerator extends BaseScaleGenerator implements IScaleGenerator {
  protected _getConfig(): IScaleGeneratorConfig {
    return {...DefaultConfig, ...this._injector.get(MONTH_SCALE_GENERATOR_CONFIG, {})};
  }

  protected _validateStartDate(startDate: DateInput): Date {
    const newDate = new Date(startDate);
    const countOfEmptyYearsBefore = 1;
    newDate.setDate(1);
    newDate.setMonth(0);
    newDate.setFullYear(newDate.getFullYear() - countOfEmptyYearsBefore);

    return newDate;
  }

  protected _validateEndDate(endDate: DateInput): Date {
    const newDate = DateHelpers.lastDayOfMonth(endDate);
    const countOfEmptyYearsAfter = 1;
    newDate.setMonth(11);
    newDate.setFullYear(newDate.getFullYear() + countOfEmptyYearsAfter);

    return newDate;
  }

  protected _generateGroups(date: Date): IScaleGroup[] {
    date = new Date(date.getFullYear(), 1, 0, 0, 0, 0, 0);
    return [{date, id: DateHelpers.generateDateId(date), coverageInPercents: 100}];
  }

  protected _getColumnIndex(date: Date): number {
    return date.getMonth() + 1;
  }

  protected _getNextColumnDate(date: Date): Date {
    return new Date(date.setMonth(date.getMonth() + 1));
  }
}

@Injectable()
export class MonthScaleGenerator extends DefaultMonthScaleGenerator {
}
