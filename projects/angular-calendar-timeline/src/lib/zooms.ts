import { ITimelineZoom, TimelineDivisionType } from "./models";
import { InjectionToken } from "@angular/core";

export const ZOOMS = new InjectionToken<ITimelineZoom[]>('Zooms');

export const DefaultZooms: ITimelineZoom[] = [
  {columnWidth: 24, division: TimelineDivisionType.Month},
  {columnWidth: 32, division: TimelineDivisionType.Month},
  {columnWidth: 45, division: TimelineDivisionType.Month},
  {columnWidth: 60, division: TimelineDivisionType.Month},
  {columnWidth: 75, division: TimelineDivisionType.Month},
  {columnWidth: 90, division: TimelineDivisionType.Month},
  {columnWidth: 120, division: TimelineDivisionType.Month},
  {columnWidth: 170, division: TimelineDivisionType.Month},
  {columnWidth: 240, division: TimelineDivisionType.Month},
  {columnWidth: 60, division: TimelineDivisionType.Week},
  {columnWidth: 90, division: TimelineDivisionType.Week},
  {columnWidth: 120, division: TimelineDivisionType.Week},
  {columnWidth: 170, division: TimelineDivisionType.Week},
  {columnWidth: 240, division: TimelineDivisionType.Week},
  {columnWidth: 45, division: TimelineDivisionType.Day},
  {columnWidth: 60, division: TimelineDivisionType.Day},
  {columnWidth: 80, division: TimelineDivisionType.Day},
  {columnWidth: 110, division: TimelineDivisionType.Day},
  {columnWidth: 140, division: TimelineDivisionType.Day},
  {columnWidth: 200, division: TimelineDivisionType.Day},
  {columnWidth: 240, division: TimelineDivisionType.Day},
].map((item, index) => ({...item, index}));

export const MinZoomIndex = 0;
export const MaxZoomIndex = DefaultZooms.length - 1;
