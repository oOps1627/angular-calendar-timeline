export interface IIdObject {
  id: number | string;
}

export interface ITimelineZoom<Division = TimelineDivisionType> {
  division: Division;

  columnWidth: number;
}

export interface ITimelineItem<Meta = any> extends IIdObject {
  name: string;

  startDate: string;

  endDate: string;

  canResizeLeft: boolean;

  canResizeRight: boolean;

  canDrag: boolean;

  expanded?: boolean;

  items?: ITimelineItem<Meta>[];

  meta?: Meta;

  /**
   * @hidden
   */
  _width?: number;

  /**
   * @hidden
   */
  _left?: number;

  /**
   * @hidden
   */
  _redraw?(): void;
}

export enum  TimelineDivisionType {
  Month,
  Week,
  Day
}

