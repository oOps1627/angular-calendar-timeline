import { IScaleGenerator } from './models';
import { MonthScaleGenerator } from './month-scale-generator';
import { WeekScaleGenerator } from './week-scale-generator';
import { DayScaleGenerator } from './day-scale-generator';
import { Inject, Injectable } from "@angular/core";
import { ITimelineZoom, TimelineDivisionType } from "../models/zoom";

export interface IScaleGeneratorsManager<Division = TimelineDivisionType> {
  getGenerator(division: Division): IScaleGenerator;
}

@Injectable()
export class DefaultScaleGeneratorsManager implements IScaleGeneratorsManager {
    protected _generatorsDictionary = {
        [TimelineDivisionType.Day]: this._dayGenerator,
        [TimelineDivisionType.Week]: this._weekGenerator,
        [TimelineDivisionType.Month]: this._monthGenerator,
    };

    constructor(@Inject(DayScaleGenerator) protected _dayGenerator: IScaleGenerator,
                @Inject(WeekScaleGenerator) protected _weekGenerator: IScaleGenerator,
                @Inject(MonthScaleGenerator) protected _monthGenerator: IScaleGenerator,
                ) {
    }

    getGenerator(division: TimelineDivisionType): IScaleGenerator {
        return this._generatorsDictionary[division];
    }
}

@Injectable()
export class ScaleGeneratorsManager extends DefaultScaleGeneratorsManager {
}

