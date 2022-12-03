import { DateInput, IScaleGenerator } from "./models";
import { ITimelineItem } from "../models";

export abstract class BaseScaleGenerator implements Pick<IScaleGenerator, 'getStartDateByFirstItem' | 'getEndDateByLastItem'> {
  protected abstract _addEmptySpaceBefore(startDate: DateInput): Date;

  protected abstract _addEmptySpaceAfter(endDate: DateInput): Date;

  public getStartDateByFirstItem(firstItem: ITimelineItem): Date {
    const now = Date.now();
    const firstItemDate = new Date(firstItem?.startDate ?? now);

    return this._addEmptySpaceBefore(firstItemDate.getTime() < now ? firstItemDate : now);
  }

  public getEndDateByLastItem(lastItem: ITimelineItem): Date {
    const now = Date.now();
    const lastItemDate = new Date(lastItem?.endDate ?? now);

    return this._addEmptySpaceAfter(lastItemDate.getTime() < now ? now : lastItemDate);
  }
}
