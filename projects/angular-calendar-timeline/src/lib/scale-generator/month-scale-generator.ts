import { DatesCacheDecorator } from '../helpers';
import { BaseScaleGenerator } from './base-scale-generator';
import { DateInput, IScale, IScaleColumn, IScaleGenerator, IScaleGroup } from './models';
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
    const scale: IScale = {
      startDate,
      endDate,
      groups: [],
      columns: [],
    };

    while (currentDate.getTime() <= endTime) {
      const group = this._generateGroup(currentDate);
      scale.groups.push(group);

      for (let i = 1; i <= group.columnsInGroup; i++) {
        const monthDate = new Date(currentDate).setMonth(i - 1);
        scale.columns.push(this._generateColumn(monthDate));
      }

      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }

    return scale;
  }

  protected _generateGroup(date: DateInput): IScaleGroup {
    date = new Date(date);

    return {
      id: DateHelpers.generateDateId(date),
      columnsInGroup: 12,
      date: date
    }
  }

  protected _generateColumn(date: DateInput): IScaleColumn {
    date = new Date(date);

    return {
      id: DateHelpers.generateDateId(date),
      index: date.getMonth() + 1,
      date: date,
    }
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
