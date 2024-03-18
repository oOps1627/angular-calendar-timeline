import { BaseScaleGenerator } from './base-scale-generator';
import { DateInput, IScaleGenerator, IScaleGeneratorConfig, IScaleGroup } from '../models';
import { DateHelpers } from "../helpers/date-helpers";
import { WeekScaleFormatter } from "../formatters/week-scale-formatter";
import { inject, Injectable, InjectionToken } from "@angular/core";

export const WEEK_SCALE_GENERATOR_CONFIG = new InjectionToken<IScaleGeneratorConfig>('Week scale config');

const DefaultConfig: IScaleGeneratorConfig = {
  formatter: new WeekScaleFormatter(),
}

@Injectable()
export class DefaultWeekScaleGenerator extends BaseScaleGenerator implements IScaleGenerator {
  protected _getConfig(): IScaleGeneratorConfig {
    return {...DefaultConfig, ...inject(WEEK_SCALE_GENERATOR_CONFIG, {})};
  }

  protected _validateStartDate(startDate: DateInput): Date {
    const countOfEmptyMonthsBefore = 1;
    const newDate: Date = new Date(startDate);
    newDate.setMonth(newDate.getMonth() - countOfEmptyMonthsBefore);

    return DateHelpers.firstMondayOfMonth(newDate);
  }

  protected _validateEndDate(endDate: DateInput): Date {
    const countOfEmptyMonthsAfter = 1;
    const newDate: Date = new Date(endDate);
    newDate.setMonth(newDate.getMonth() + countOfEmptyMonthsAfter);

    return DateHelpers.lastDayOfWeek(newDate);
  }

  protected _generateGroups(date: Date): IScaleGroup[] {
    const weekStart: Date = DateHelpers.firstDayOfWeek(date);
    const weekEnd: Date = DateHelpers.lastDayOfWeek(date);
    const weekRelatedToTwoMonths: boolean = weekStart.getMonth() !== weekEnd.getMonth();

    const weekStartGroupDate: Date = new Date(weekStart.getFullYear(), weekStart.getMonth(), 1, 0, 0, 0, 0);

    const groups: IScaleGroup[] = [
      {date: weekStartGroupDate, id: DateHelpers.generateDateId(weekStartGroupDate), coverageInPercents: 100}
    ];

    if (weekRelatedToTwoMonths) {
      groups[0].coverageInPercents = (DateHelpers.getDaysInMonth(weekStart) - (weekStart.getDate() - 1)) / 7 * 100;

      const weekEndGroupDate: Date = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), 1, 0, 0, 0, 0);

      groups.push({
        date: weekEndGroupDate,
        id: DateHelpers.generateDateId(weekEndGroupDate),
        coverageInPercents: 100 - groups[0].coverageInPercents
      })
    }

    return groups;
  }

  protected _getColumnIndex(date: Date): number {
    const weekMonday: Date = DateHelpers.firstDayOfWeek(date);

    return Math.ceil(weekMonday.getDate() / 7);
  }

  protected _getNextColumnDate(date: Date): Date {
    return new Date(date.setDate(date.getDate() + 7));
  }
}

@Injectable()
export class WeekScaleGenerator extends DefaultWeekScaleGenerator {
}
