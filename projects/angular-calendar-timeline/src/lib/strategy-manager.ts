import {
  IViewModeAdaptor,
  IScaleGenerator,
  TimelineViewMode
} from "./models";
import { Inject, Injectable } from "@angular/core";
import { DayScaleGenerator } from "./scale-generator/day-scale-generator";
import { WeekScaleGenerator } from "./scale-generator/week-scale-generator";
import { MonthScaleGenerator } from "./scale-generator/month-scale-generator";
import { DaysViewModeAdaptor } from "./view-mode-adaptor/days-view-mode-adaptor";
import { WeeksViewModeAdaptor } from "./view-mode-adaptor/weeks-view-mode-adaptor";
import { MonthsViewModeAdaptor } from "./view-mode-adaptor/months-view-mode-adaptor";

export interface IStrategyManager<ViewMode = TimelineViewMode> {
  getScaleGenerator(viewMode: ViewMode): IScaleGenerator;

  getViewModeAdaptor(viewMode: ViewMode): IViewModeAdaptor;
}

@Injectable()
export class DefaultStrategyManager<ViewMode> implements IStrategyManager<ViewMode> {
  protected _generatorsDictionary = {
    [TimelineViewMode.Day]: this._dayGenerator,
    [TimelineViewMode.Week]: this._weekGenerator,
    [TimelineViewMode.Month]: this._monthGenerator,
  };

  protected _calculatorsDictionary = {
    [TimelineViewMode.Day]: new DaysViewModeAdaptor(),
    [TimelineViewMode.Week]: new WeeksViewModeAdaptor(),
    [TimelineViewMode.Month]: new MonthsViewModeAdaptor(),
  };

  constructor(@Inject(DayScaleGenerator) protected _dayGenerator: IScaleGenerator,
              @Inject(WeekScaleGenerator) protected _weekGenerator: IScaleGenerator,
              @Inject(MonthScaleGenerator) protected _monthGenerator: IScaleGenerator,
  ) {
  }

  getViewModeAdaptor(viewMode: ViewMode): IViewModeAdaptor {
    return this._calculatorsDictionary[viewMode as unknown as TimelineViewMode];
  }

  getScaleGenerator(viewMode: ViewMode): IScaleGenerator {
    return this._generatorsDictionary[viewMode as unknown as TimelineViewMode];
  }
}

@Injectable()
export class StrategyManager<ViewMode = TimelineViewMode> extends DefaultStrategyManager<ViewMode> {
}
