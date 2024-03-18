import {
  DateInput,
  IItemsIterator,
  IScale,
  IScaleColumn,
  IScaleFormatter,
  IScaleGenerator,
  IScaleGeneratorConfig,
  IScaleGroup
} from "../models";
import { Injectable } from "@angular/core";
import { DateHelpers } from "../helpers/date-helpers";
import { DatesCacheDecorator } from "../helpers/cache";

@Injectable()
export abstract class BaseScaleGenerator implements IScaleGenerator {
  protected _config: IScaleGeneratorConfig;

  public formatter: IScaleFormatter;

  constructor() {
    this._config = this._getConfig();
    this.formatter = this._config.formatter;
  }

  protected abstract _getConfig(): IScaleGeneratorConfig;

  protected abstract _validateStartDate(startDate: DateInput): Date;

  protected abstract _validateEndDate(endDate: DateInput): Date;

  protected abstract _generateGroups(date: Date): IScaleGroup[];

  protected abstract _getColumnIndex(date: Date): number;

  protected abstract _getNextColumnDate(date: Date): Date;

  public getStartDate(itemsBuilder: IItemsIterator): Date {
    if (this._config.getStartDate) {
      return this._config.getStartDate(itemsBuilder);
    }

    const firstItem = itemsBuilder.getFirstItem(false);
    const now = Date.now();
    const firstItemTime = new Date(firstItem?.startDate ?? now).getTime();

    return this._validateStartDate(firstItemTime < now ? firstItemTime : now);
  }

  public getEndDate(itemsBuilder: IItemsIterator): Date {
    if (this._config.getEndDate) {
      return this._config.getEndDate(itemsBuilder);
    }

    const lastItem = itemsBuilder.getLastItem(false);
    const now = Date.now();
    const lastItemDate = new Date(lastItem?.endDate ?? now);

    return this._validateEndDate(lastItemDate.getTime() < now ? now : lastItemDate);
  }

  @DatesCacheDecorator()
  generateScale(startDate: Date, endDate: Date): IScale {
    let currentDate: Date = new Date(startDate);
    const endTime: number = endDate.getTime();
    const columns: IScaleColumn[] = [];
    while (currentDate.getTime() <= endTime) {
      const date = new Date(currentDate);
      columns.push({
        id: DateHelpers.generateDateId(date),
        date: date,
        index: this._getColumnIndex(date),
        groups: this._generateGroups(date),
      });

      currentDate = this._getNextColumnDate(currentDate);
    }

    return {
      startDate,
      endDate,
      columns
    };
  }
}
