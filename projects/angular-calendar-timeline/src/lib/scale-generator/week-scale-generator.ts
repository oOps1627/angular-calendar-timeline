import { DatesCacheDecorator } from '../helpers';
import { BaseScaleGenerator } from './base-scale-generator';
import { DateInput, IScale, IScaleGenerator } from './models';
import { DateHelpers } from "../date-helpers";
import { WeekScaleColumnFormatter } from "../formatters/scale-column-formatters";
import { WeekScaleGroupFormatter } from "../formatters/scale-group-formatters";

export class WeekScaleGenerator extends BaseScaleGenerator implements IScaleGenerator {
  columnsFormatter = new WeekScaleColumnFormatter();
  groupsFormatter = new WeekScaleGroupFormatter();

  protected readonly countOfWeeksAfterLastItem = 24;
  protected readonly countOfWeeksBeforeFirstItem = 4;

  @DatesCacheDecorator()
  generateScale(startDate: Date, endDate: Date): IScale {
    const data: IScale = {
      startDate,
      endDate,
      groups: [],
      columns: []
    };
    const currentWeek = new Date(startDate);
    const endTime = endDate.getTime();
    let weekNumber = 0;
    let monthNumber = currentWeek.getMonth();

    data.groups.push({
      id: DateHelpers.generateDateId(currentWeek),
      date: new Date(currentWeek),
      columnsInGroup: (DateHelpers.getLastDayOfMonth(currentWeek).getDate() - currentWeek.getDate() + 1) / 7,
    });

    while (currentWeek.getTime() < endTime) {
      if (monthNumber === currentWeek.getMonth()) {
        weekNumber++;
      } else {
        weekNumber = 1;
        monthNumber = currentWeek.getMonth();
        data.groups.push({
          id: DateHelpers.generateDateId(currentWeek),
          date: new Date(currentWeek),
          columnsInGroup: DateHelpers.getLastDayOfMonth(currentWeek).getDate() / 7,
        });
      }

      data.columns.push({
        id: DateHelpers.generateDateId(currentWeek),
        date: currentWeek,
        index: weekNumber,
      });

      currentWeek.setDate(currentWeek.getDate() + 7);
    }

    const lastGroup = data.groups[data.groups.length - 1];

    if (lastGroup.date.getMonth() !== currentWeek.getMonth()) {
      lastGroup.columnsInGroup = (DateHelpers.getLastDayOfMonth(lastGroup.date).getDate() + currentWeek.getDate() - 1) / 7;
    } else {
      lastGroup.columnsInGroup = currentWeek.getDate() / 7;
    }

    return data;
  }

  protected _addEmptySpaceBefore(startDate: DateInput): Date {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - (this.countOfWeeksBeforeFirstItem * 7));
    return DateHelpers.getFirstMondayOfMonth(newDate);
  }

  protected _addEmptySpaceAfter(endDate: DateInput): Date {
    const lastDayOfWeek = DateHelpers.getLastDayOfWeek(endDate);
    return new Date(lastDayOfWeek.setDate(lastDayOfWeek.getDate() + this.countOfWeeksAfterLastItem * 7));
  }
}
