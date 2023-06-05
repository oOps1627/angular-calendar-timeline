import { ITimelineItem } from "angular-calendar-timeline";

export interface IItemTimeChangedEvent {
  item: ITimelineItem;
  newStartDate?: Date;
  newEndDate?: Date
}

export interface IItemRowChangedEvent {
  item: ITimelineItem;
  newRow: ITimelineItem | undefined;
  oldRow: ITimelineItem | undefined;
}
