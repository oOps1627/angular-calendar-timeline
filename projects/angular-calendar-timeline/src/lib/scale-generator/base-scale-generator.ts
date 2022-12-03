import { DateInput, IScaleGenerator } from "./models";
import { ITimelineItem } from "../models";
import { Injectable, Injector } from "@angular/core";

@Injectable()
export abstract class BaseScaleGenerator implements Pick<IScaleGenerator, 'getStartDateByFirstItem' | 'getEndDateByLastItem'> {
  constructor(protected _injector: Injector) {
  }

  protected abstract _addEmptySpaceBefore(startDate: DateInput): Date;

  protected abstract _addEmptySpaceAfter(endDate: DateInput): Date;

  public getStartDateByFirstItem(firstItem: ITimelineItem): Date {
    const now = Date.now();
    const firstItemTime = new Date(firstItem?.startDate ?? now).getTime();

    return this._addEmptySpaceBefore(firstItemTime < now ? firstItemTime : now);
  }

  public getEndDateByLastItem(lastItem: ITimelineItem): Date {
    const now = Date.now();
    const lastItemDate = new Date(lastItem?.endDate ?? now);

    return this._addEmptySpaceAfter(lastItemDate.getTime() < now ? now : lastItemDate);
  }
}
