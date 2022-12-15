export enum TimelineDivisionType {
  Month,
  Week,
  Day
}

export interface ITimelineZoom<Division = TimelineDivisionType> {
  division: Division;

  columnWidth: number;
}
