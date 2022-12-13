import { IScaleFormatter } from "../formatters/scale-formatter.interface";
import { IItemsBuilder } from "../items-builder/items-builder.interface";

export type DateInput = Date | string | number;

export interface IScaleColumn {
  id: string;
  date: Date;
  index: number;
}

export interface IScaleGroup {
  id: string;
  columnsInGroup: number;
  date: Date;
}

export interface IScale {
  startDate: Date;
  endDate: Date;
  columns: IScaleColumn[];
  groups?: IScaleGroup[];
}

export interface IScaleGenerator {
  formatter: IScaleFormatter;

  generateScale(startDate: Date, endDate: Date): IScale;

  getStartDate(itemsBuilder: IItemsBuilder): Date;

  getEndDate(itemsBuilder: IItemsBuilder): Date;
}
