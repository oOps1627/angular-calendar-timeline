import { IScale, IScaleFormatter, IScaleGenerator, DateInput, IItemsBuilder } from "../models";
import { Injectable, Injector } from "@angular/core";

@Injectable()
export abstract class BaseScaleGenerator implements IScaleGenerator {
  abstract formatter: IScaleFormatter;

  constructor(protected _injector: Injector) {
  }

  protected abstract _addEmptySpaceBefore(startDate: DateInput): Date;

  protected abstract _addEmptySpaceAfter(endDate: DateInput): Date;

  abstract generateScale(startDate: Date, endDate: Date): IScale;

  public getStartDate(itemsBuilder: IItemsBuilder): Date {
    const firstItem = itemsBuilder.getFirstItem(false);
    const now = Date.now();
    const firstItemTime = new Date(firstItem?.startDate ?? now).getTime();

    return this._addEmptySpaceBefore(firstItemTime < now ? firstItemTime : now);
  }

  public getEndDate(itemsBuilder: IItemsBuilder): Date {
    const lastItem = itemsBuilder.getLastItem(false);
    const now = Date.now();
    const lastItemDate = new Date(lastItem?.endDate ?? now);

    return this._addEmptySpaceAfter(lastItemDate.getTime() < now ? now : lastItemDate);
  }
}
