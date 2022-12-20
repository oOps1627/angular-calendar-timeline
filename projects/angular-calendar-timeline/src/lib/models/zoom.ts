export enum TimelineViewMode {
  Month = 'Month',
  Week = 'Week',
  Day = 'Day'
}

export interface ITimelineZoom<ViewMode = TimelineViewMode> {
  viewMode: ViewMode;

  columnWidth: number;
}
