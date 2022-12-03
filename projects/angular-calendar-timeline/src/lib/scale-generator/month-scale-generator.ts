import { DatesCacheDecorator, generateDateId } from '../helpers';
import { BaseScaleGenerator } from './base-scale-generator';
import { DateInput, IScale, IScaleGenerator } from './models';
import { DateHelpers } from "../date-helpers";
import { MonthScaleColumnFormatter } from "../formatters/scale-column-formatters";
import { MonthScaleGroupFormatter } from "../formatters/scale-group-formatters";

export class MonthScaleGenerator extends BaseScaleGenerator implements IScaleGenerator {
  columnsFormatter = new MonthScaleColumnFormatter();
  groupsFormatter = new MonthScaleGroupFormatter();

  private readonly countOfYearsAfterLastItem = 4;
  private readonly countOfYearsBeforeFirstItem = 1;

  @DatesCacheDecorator()
  generateScale(startDate: Date, endDate: Date): IScale {
    const currentDate = new Date(startDate);
    const endTime = endDate.getTime();
    const data: IScale = {
      startDate,
      endDate,
      groups: [],
      columns: [],
    };
    while (currentDate.getTime() <= endTime) {
      data.groups.push({
        id: generateDateId(currentDate),
        columnsInGroup: 12,
        date: new Date(currentDate)
      });
      for (let i = 1; i <= 12; i++) {
        const monthDate = new Date(currentDate);
        monthDate.setMonth(i - 1);

        data.columns.push({
          id: generateDateId(monthDate),
          index: i,
          date: currentDate,
        });
      }
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }

    return data;
  }

  protected _addEmptySpaceBefore(startDate: DateInput): Date {
    const newDate = new Date(startDate);
    newDate.setDate(1);
    newDate.setMonth(0);
    newDate.setFullYear(newDate.getFullYear() - this.countOfYearsBeforeFirstItem);

    return newDate;
  }

  protected _addEmptySpaceAfter(endDate: DateInput): Date {
    const newDate = DateHelpers.getLastDayOfMonth(endDate);
    newDate.setMonth(11);
    newDate.setFullYear(newDate.getFullYear() + this.countOfYearsAfterLastItem);

    return newDate;
  }
}
