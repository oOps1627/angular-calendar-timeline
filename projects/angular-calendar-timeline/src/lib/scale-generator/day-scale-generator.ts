import { DatesCacheDecorator } from '../helpers/cache';
import { BaseScaleGenerator } from './base-scale-generator';
import { IScale, IScaleColumn, IScaleGenerator, IScaleGroup } from '../models/scale';
import { DateHelpers } from "../helpers/date-helpers";
import { DAY_SCALE_FORMATTER } from "../formatters/day-scale-formatter";
import { Injectable } from "@angular/core";
import { DateInput } from "../models/date-input";

@Injectable()
export class DefaultDayScaleGenerator extends BaseScaleGenerator implements IScaleGenerator {
  formatter = this._injector.get(DAY_SCALE_FORMATTER);

  protected readonly countOfMonthsAfterLastItem = 5;
  protected readonly countOfMonthsBeforeFirstItem = 1;

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

    while (currentDate.getTime() < endTime) {
      const group = this._generateGroup(currentDate);
      scale.groups.push(group);

      for (let i = currentDate.getDate(); i <= group.columnsInGroup; i++) {
        const column = this._generateColumn(new Date(currentDate).setDate(i));
        scale.columns.push(column);
      }

      currentDate.setDate(1);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return scale;
  }

  protected _generateGroup(date: Date): IScaleGroup {
    return {
      id: DateHelpers.generateDateId(date),
      columnsInGroup: DateHelpers.getDaysInMonth(date),
      date: new Date(date),
    }
  }

  protected _generateColumn(date: DateInput): IScaleColumn {
    date = new Date(date);

    return {
      id: DateHelpers.generateDateId(date),
      date: date,
      index: date.getDate(),
    };
  }

  protected _addEmptySpaceBefore(startDate: DateInput): Date {
    startDate = new Date(startDate);
    startDate.setDate(1);
    startDate = DateHelpers.setDayBeginningTime(startDate);
    startDate.setMonth(startDate.getMonth() - this.countOfMonthsBeforeFirstItem);

    return startDate;
  }

  protected _addEmptySpaceAfter(endDate: DateInput): Date {
    endDate = new Date(endDate);
    return new Date(DateHelpers.getLastDayOfMonth(endDate).setMonth(endDate.getMonth() + this.countOfMonthsAfterLastItem));
  }
}

@Injectable()
export class DayScaleGenerator extends DefaultDayScaleGenerator {
}
