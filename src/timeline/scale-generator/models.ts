import { IIdObject, ITimelineItem } from "../models";

export type DateInput = Date | string | number;

export interface IScaleColumn extends IIdObject {
  name: string;
  date: Date;
  shortName?: string;
  longName?: string;
}

export interface IScaleHeaderGroup extends IIdObject {
  name: string;
  columnsCount: number;
  date: Date;
}

export interface IScale {
  headerGroups: IScaleHeaderGroup[];
  columns: IScaleColumn[];
}

export interface IScaleGenerator {
  generateScale(startDate: Date, endDate: Date): IScale;

  getStartDateByFirstItem(firstItem: ITimelineItem): Date;

  getEndDateByLastItem(lastItem: ITimelineItem): Date;
}
