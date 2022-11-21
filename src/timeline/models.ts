export interface IIdObject {
  id: number | string;
}

export interface ITimelineZoom {
  division: TimelineZoomDivision;
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
  width?: number;
  left?: number;
  meta?: Meta;
  onUpdate?: () => void;
}

export interface ITimelineGroup<ItemMeta = any, Meta = any> extends IIdObject {
  name: string;
  expanded: boolean;
  height?: number;
  items?: ITimelineItem<ItemMeta>[];
  groups?: ITimelineGroup[];
  meta?: Meta;
}

export interface ITimelineState {
  zoom?: ITimelineZoom;
  currentDate?: string;
}

export enum TimelineZoomDivision {
  Month,
  Week,
  Day
}

export const TimelineZooms: ITimelineZoom[] = [
  {columnWidth: 24, division: TimelineZoomDivision.Month},
  {columnWidth: 32, division: TimelineZoomDivision.Month},
  {columnWidth: 45, division: TimelineZoomDivision.Month},
  {columnWidth: 60, division: TimelineZoomDivision.Month},
  {columnWidth: 75, division: TimelineZoomDivision.Month},
  {columnWidth: 90, division: TimelineZoomDivision.Month},
  {columnWidth: 120, division: TimelineZoomDivision.Month},
  {columnWidth: 170, division: TimelineZoomDivision.Month},
  {columnWidth: 240, division: TimelineZoomDivision.Month},
  {columnWidth: 60, division: TimelineZoomDivision.Week},
  {columnWidth: 90, division: TimelineZoomDivision.Week},
  {columnWidth: 120, division: TimelineZoomDivision.Week},
  {columnWidth: 170, division: TimelineZoomDivision.Week},
  {columnWidth: 240, division: TimelineZoomDivision.Week},
  {columnWidth: 45, division: TimelineZoomDivision.Day},
  {columnWidth: 60, division: TimelineZoomDivision.Day},
  {columnWidth: 80, division: TimelineZoomDivision.Day},
  {columnWidth: 110, division: TimelineZoomDivision.Day},
  {columnWidth: 140, division: TimelineZoomDivision.Day},
  {columnWidth: 200, division: TimelineZoomDivision.Day},
  {columnWidth: 240, division: TimelineZoomDivision.Day},
].map((item, index) => ({...item, index}));

export const TimelineMaxZoomIndex = TimelineZooms.length - 1;
export const TimelineMinZoomIndex = 0;

