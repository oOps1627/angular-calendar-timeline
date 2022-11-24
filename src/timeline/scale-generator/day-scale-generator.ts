import { DatesCacheDecorator, generateDateId } from '../helpers';
import { BaseScaleGenerator } from './base-scale-generator';
import { DateInput, IScale, IScaleColumn, IScaleGenerator } from './models';
import { DateHelpers } from "../date-helpers";

export class DayScaleGenerator extends BaseScaleGenerator implements IScaleGenerator {

  private readonly countOfMonthsAfterLastItem = 5;
  private readonly countOfMonthsBeforeFirstItem = 1;

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

    while (currentDate.getTime() < endTime) {
      const daysInCurrentMonth = DateHelpers.getDaysInMonth(currentDate);
      data.groups.push({
        id: generateDateId(currentDate),
        name: this.localDatePipe.transform(currentDate, 'LLLL') ?? '',
        columnsInGroup: daysInCurrentMonth,
        date: new Date(currentDate),
      });

      for (let i = currentDate.getDate(); i <= daysInCurrentMonth; i++) {
        const currentDay = new Date(currentDate).setDate(i);
        data.columns.push(this._generateColumn(new Date(currentDay)));
      }

      currentDate.setDate(1);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return data;
  }

  private _generateColumn(date: Date): IScaleColumn {
    return {
      id: generateDateId(date),
      date: date,
      name: this.localDatePipe.transform(date, 'EEE dd/MM') ?? '',
      shortName: this.localDatePipe.transform(date, 'dd') ?? '',
      longName: this.localDatePipe.transform(date, 'EEEE dd/MM') ?? '',
    };
  }

  protected _addEmptySpaceBefore(startDate: DateInput): Date {
    const newDate = new Date(startDate);
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() - this.countOfMonthsBeforeFirstItem);

    return newDate;
  }

  protected _addEmptySpaceAfter(endDate: DateInput): Date {
    endDate = new Date(endDate);
    return new Date(DateHelpers.getLastDayOfMonth(endDate).setMonth(endDate.getMonth() + this.countOfMonthsAfterLastItem));
  }
}
