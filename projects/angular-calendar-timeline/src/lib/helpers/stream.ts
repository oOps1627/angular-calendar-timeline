import { ITimelineItem } from "angular-calendar-timeline";

export function isStream(item: ITimelineItem): boolean {
  return !!item.streamItems;
}
