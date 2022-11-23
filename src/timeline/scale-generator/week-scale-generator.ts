import { DatesCacheDecorator, generateDateId } from '../helpers';
import { BaseScaleGenerator } from './base-scale-generator';
import { DateInput, IScale, IScaleGenerator } from './models';
import { DateHelpers } from "../date-helpers";

export class WeekScaleGenerator extends BaseScaleGenerator implements IScaleGenerator {
  private readonly countOfWeeksAfterLastItem = 24;
  private readonly countOfWeeksBeforeFirstItem = 4;

  @DatesCacheDecorator()
  generateScale(startDate: Date, endDate: Date): IScale {
    const data: IScale = {
      startDate,
      endDate,
      headerGroups: [],
      columns: []
    };
    const currentWeek = new Date(startDate);
    const endTime = endDate.getTime();
    let weekNumber = 0;
    let monthNumber = currentWeek.getMonth();
    // TODO: translate
    const weekName = 'week';

    data.headerGroups.push({
      id: generateDateId(currentWeek),
      name: `${this.localDatePipe.transform(currentWeek, 'LLLL y')}`,
      columnsCount: (DateHelpers.getLastDayOfMonth(currentWeek).getDate() - currentWeek.getDate() + 1) / 7,
      date: new Date(currentWeek)
    });

    while (currentWeek.getTime() < endTime) {
      if (monthNumber === currentWeek.getMonth()) {
        weekNumber++;
      } else {
        weekNumber = 1;
        monthNumber = currentWeek.getMonth();
        data.headerGroups.push({
          id: generateDateId(currentWeek),
          date: new Date(currentWeek),
          name: `${this.localDatePipe.transform(currentWeek, 'LLLL y')}`,
          columnsCount: DateHelpers.getLastDayOfMonth(currentWeek).getDate() / 7,
        });
      }

      data.columns.push({
        id: generateDateId(currentWeek),
        date: currentWeek,
        shortName: String(weekNumber),
        name: `${weekName} ${weekNumber}`,
      });

      currentWeek.setDate(currentWeek.getDate() + 7);
    }

    const lastGroup = data.headerGroups[data.headerGroups.length - 1];

    if (lastGroup.date.getMonth() !== currentWeek.getMonth()) {
      lastGroup.columnsCount = (DateHelpers.getLastDayOfMonth(lastGroup.date).getDate() + currentWeek.getDate() - 1) / 7;
    } else {
      lastGroup.columnsCount = currentWeek.getDate() / 7;
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

