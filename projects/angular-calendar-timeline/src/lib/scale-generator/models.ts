import { IIdObject, ITimelineItem } from "../models";
import { IScaleColumnFormatter } from "../formatters/scale-column-formatters";
import { IScaleGroupFormatter } from "../formatters/scale-group-formatters";

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
  columnsFormatter: IScaleColumnFormatter;

  groupsFormatter?: IScaleGroupFormatter;

  generateScale(startDate: Date, endDate: Date): IScale;

  getStartDateByFirstItem(firstItem: ITimelineItem): Date;

  getEndDateByLastItem(lastItem: ITimelineItem): Date;
}
