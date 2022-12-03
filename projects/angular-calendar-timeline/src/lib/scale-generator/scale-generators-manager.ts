import { ITimelineZoom, TimelineDivisionType } from '../models';
import { IScaleGenerator } from './models';
import { MonthScaleGenerator } from './month-scale-generator';
import { WeekScaleGenerator } from './week-scale-generator';
import { DayScaleGenerator } from './day-scale-generator';
import { Injectable, InjectionToken } from "@angular/core";

export const SCALE_GENERATORS_FACTORY = new InjectionToken<IScaleGeneratorsManager>('ScaleGeneratorsFactory');

export interface IScaleGeneratorsManager {
  getGenerator(zoom: ITimelineZoom): IScaleGenerator;
}

@Injectable()
export class ScaleGeneratorsManager implements IScaleGeneratorsManager {
    private _generatorsDictionary = {
        [TimelineDivisionType.Day]: new DayScaleGenerator(),
        [TimelineDivisionType.Week]: new WeekScaleGenerator(),
        [TimelineDivisionType.Month]: new MonthScaleGenerator(),
    };

    getGenerator(zoom: ITimelineZoom): IScaleGenerator {
        return this._generatorsDictionary[zoom.division];
    }
}



