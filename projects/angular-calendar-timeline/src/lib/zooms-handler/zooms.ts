import { InjectionToken } from "@angular/core";
import { ITimelineZoom, TimelineViewMode } from "../models";

export const ZOOMS = new InjectionToken<ITimelineZoom[]>('Zooms');

export const DefaultZooms: ITimelineZoom[] = [
  {columnWidth: 45, viewMode: TimelineViewMode.Month},
  {columnWidth: 60, viewMode: TimelineViewMode.Month},
  {columnWidth: 80, viewMode: TimelineViewMode.Month},
  {columnWidth: 110, viewMode: TimelineViewMode.Month},
  {columnWidth: 140, viewMode: TimelineViewMode.Month},
  {columnWidth: 200, viewMode: TimelineViewMode.Month},
  {columnWidth: 240, viewMode: TimelineViewMode.Month},
  {columnWidth: 60, viewMode: TimelineViewMode.Week},
  {columnWidth: 80, viewMode: TimelineViewMode.Week},
  {columnWidth: 110, viewMode: TimelineViewMode.Week},
  {columnWidth: 140, viewMode: TimelineViewMode.Week},
  {columnWidth: 200, viewMode: TimelineViewMode.Week},
  {columnWidth: 240, viewMode: TimelineViewMode.Week},
  {columnWidth: 45, viewMode: TimelineViewMode.Day},
  {columnWidth: 60, viewMode: TimelineViewMode.Day},
  {columnWidth: 80, viewMode: TimelineViewMode.Day},
  {columnWidth: 110, viewMode: TimelineViewMode.Day},
  {columnWidth: 140, viewMode: TimelineViewMode.Day},
  {columnWidth: 200, viewMode: TimelineViewMode.Day},
  {columnWidth: 240, viewMode: TimelineViewMode.Day},
];
