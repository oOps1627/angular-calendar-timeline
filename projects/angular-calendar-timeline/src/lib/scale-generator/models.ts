import { IIdObject, ITimelineItem } from "../models";
import { IScaleFormatter } from "../formatters/scale-formatter.interface";

export type DateInput = Date | string | number;

export interface IScaleColumn extends IIdObject {
  date: Date;
  index: number;
}

export interface IScaleGroup extends IIdObject {
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

  getStartDateByFirstItem(firstItem: ITimelineItem): Date;

  getEndDateByLastItem(lastItem: ITimelineItem): Date;
}
