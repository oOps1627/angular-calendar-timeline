import {
  IDivisionAdaptor,
  IScaleGenerator,
  TimelineDivisionType
} from "./models";
import { Inject, Injectable } from "@angular/core";
import { DayScaleGenerator } from "./scale-generator/day-scale-generator";
import { WeekScaleGenerator } from "./scale-generator/week-scale-generator";
import { MonthScaleGenerator } from "./scale-generator/month-scale-generator";
import { DaysDivisionAdaptor } from "./divisions-adaptor/days-division-adaptor";
import { WeeksDivisionAdaptor } from "./divisions-adaptor/weeks-division-adaptor";
import { MonthsDivisionAdaptor } from "./divisions-adaptor/months-division-adaptor";

export interface IStrategyManager<Division = TimelineDivisionType> {
  getGenerator(division: Division): IScaleGenerator;

  getAdaptor(division: Division): IDivisionAdaptor;
}

@Injectable()
export class DefaultStrategyManager<Division> implements IStrategyManager<Division> {
  protected _generatorsDictionary = {
    [TimelineDivisionType.Day]: this._dayGenerator,
    [TimelineDivisionType.Week]: this._weekGenerator,
    [TimelineDivisionType.Month]: this._monthGenerator,
  };

  protected _calculatorsDictionary = {
    [TimelineDivisionType.Day]: new DaysDivisionAdaptor(),
    [TimelineDivisionType.Week]: new WeeksDivisionAdaptor(),
    [TimelineDivisionType.Month]: new MonthsDivisionAdaptor(),
  };

  constructor(@Inject(DayScaleGenerator) protected _dayGenerator: IScaleGenerator,
              @Inject(WeekScaleGenerator) protected _weekGenerator: IScaleGenerator,
              @Inject(MonthScaleGenerator) protected _monthGenerator: IScaleGenerator,
  ) {
  }

  getAdaptor(division: Division): IDivisionAdaptor {
    return this._calculatorsDictionary[division as unknown as TimelineDivisionType];
  }

  getGenerator(division: Division): IScaleGenerator {
    return this._generatorsDictionary[division as unknown as TimelineDivisionType];
  }
}

@Injectable()
export class StrategyManager<Division = TimelineDivisionType> extends DefaultStrategyManager<Division> {
}
