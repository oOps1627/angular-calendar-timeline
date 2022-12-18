import { InjectionToken } from "@angular/core";
import { ITimelineZoom, TimelineDivisionType } from "../models";

export const ZOOMS = new InjectionToken<ITimelineZoom[]>('Zooms');

export const DefaultZooms: ITimelineZoom[] = [
  {columnWidth: 45, division: TimelineDivisionType.Month},
  {columnWidth: 60, division: TimelineDivisionType.Month},
  {columnWidth: 80, division: TimelineDivisionType.Month},
  {columnWidth: 110, division: TimelineDivisionType.Month},
  {columnWidth: 140, division: TimelineDivisionType.Month},
  {columnWidth: 200, division: TimelineDivisionType.Month},
  {columnWidth: 240, division: TimelineDivisionType.Month},
  {columnWidth: 60, division: TimelineDivisionType.Week},
  {columnWidth: 80, division: TimelineDivisionType.Week},
  {columnWidth: 110, division: TimelineDivisionType.Week},
  {columnWidth: 140, division: TimelineDivisionType.Week},
  {columnWidth: 200, division: TimelineDivisionType.Week},
  {columnWidth: 240, division: TimelineDivisionType.Week},
  {columnWidth: 45, division: TimelineDivisionType.Day},
  {columnWidth: 60, division: TimelineDivisionType.Day},
  {columnWidth: 80, division: TimelineDivisionType.Day},
  {columnWidth: 110, division: TimelineDivisionType.Day},
  {columnWidth: 140, division: TimelineDivisionType.Day},
  {columnWidth: 200, division: TimelineDivisionType.Day},
  {columnWidth: 240, division: TimelineDivisionType.Day},
];
