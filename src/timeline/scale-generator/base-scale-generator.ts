import { DatePipe } from "@angular/common";
import { DateInput, IScaleGenerator } from "./models";
import { ITimelineItem } from "../models";

export abstract class BaseScaleGenerator implements Pick<IScaleGenerator, 'getStartDateByFirstItem' | 'getEndDateByLastItem'> {
  // TODO: locale
  protected localDatePipe = new DatePipe('en');

  protected abstract _addEmptySpaceBefore(startDate: DateInput): Date;

  protected abstract _addEmptySpaceAfter(endDate: DateInput): Date;

  public getStartDateByFirstItem(firstItem: ITimelineItem): Date {
    const now = Date.now();

    return this._addEmptySpaceBefore(new Date(firstItem.startDate).getTime() < now ? firstItem.startDate : now);
  }

  public getEndDateByLastItem(lastItem: ITimelineItem): Date {
    const now = Date.now();

    return this._addEmptySpaceAfter(new Date(lastItem.endDate).getTime() < now ? now : lastItem.endDate);
  }
}
