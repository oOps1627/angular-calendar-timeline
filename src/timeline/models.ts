export interface IIdObject {
  id: number | string;
}

export interface ITimelineZoom<Division = TimelineDivisionType> {
  division: Division;
  columnWidth: number;
  index: number;
}

export interface ITimelineItem<Meta = any> extends IIdObject {
  name: string;
  startDate: string;
  endDate: string;
  canResizeLeft: boolean;
  canResizeRight: boolean;
  canDrag: boolean;
  expanded?: boolean;
  height?: number;
  items?: ITimelineItem<Meta>[];
  width?: number;
  left?: number;
  meta?: Meta;
  onUpdate?: () => void;
}

export interface ITimelineState {
  zoom?: ITimelineZoom;
  currentDate?: string;
}

export enum  TimelineDivisionType {
  Month,
  Week,
  Day
}

