import { IIdObject, ITimelineItem } from "../models";

export type DateInput = Date | string | number;

export interface IScaleColumn extends IIdObject {
  name: string;
  date: Date;
  shortName?: string;
  longName?: string;
}

export interface IScaleGroup extends IIdObject {
  name: string;
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
  generateScale(startDate: Date, endDate: Date): IScale;

  getStartDateByFirstItem(firstItem: ITimelineItem): Date;

  getEndDateByLastItem(lastItem: ITimelineItem): Date;
}
