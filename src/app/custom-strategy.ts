import {
  IScaleGenerator,
  IStrategyManager, ITimelineZoom,
  IViewModeAdaptor,
  StrategyManager,
  TimelineViewMode
} from "angular-calendar-timeline";

export enum CustomViewMode {
  Custom = 1,
  Day = TimelineViewMode.Day,
  Week = TimelineViewMode.Week,
  Month = TimelineViewMode.Month,
}

export class TimelineZoom implements ITimelineZoom<CustomViewMode> {
  viewMode!: CustomViewMode;
  columnWidth!: number;
}

class CustomStrategyManager extends StrategyManager implements IStrategyManager<CustomViewMode> {
  override getScaleGenerator(viewMode): IScaleGenerator {
    if (viewMode === CustomViewMode.Custom) {
      return null;  // your custom logic here
    }

    return super.getScaleGenerator(viewMode);
  };

  override getViewModeAdaptor(viewMode): IViewModeAdaptor {
    if (viewMode === CustomViewMode.Custom) {
      return null // custom adaptor;
    }

    return super.getViewModeAdaptor(viewMode); //This should be  super.getViewModeAdaptor(viewMode);
  }
}
