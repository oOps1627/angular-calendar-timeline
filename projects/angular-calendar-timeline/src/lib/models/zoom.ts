export enum TimelineViewMode {
  Month = 101,
  Week = 102,
  Day = 103
}

export interface ITimelineZoom<ViewMode = TimelineViewMode> {
  viewMode: ViewMode;

  columnWidth: number;
}
