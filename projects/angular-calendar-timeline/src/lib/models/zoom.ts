export enum TimelineDivisionType {
  Month = 'Month',
  Week = 'Week',
  Day = 'Day'
}

export interface ITimelineZoom<Division = TimelineDivisionType> {
  division: Division;

  columnWidth: number;
}
