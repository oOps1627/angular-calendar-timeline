import { ITimelineZoom, TimelineDivisionType } from '../models';
import { IScaleGenerator } from './models';
import { MonthScaleGenerator } from './month-scale-generator';
import { WeekScaleGenerator } from './week-scale-generator';
import { DayScaleGenerator } from './day-scale-generator';
import { InjectionToken } from "@angular/core";

export const SCALE_GENERATORS_FACTORY = new InjectionToken<IScaleGeneratorsFactory>('ScaleGeneratorsFactory');

export interface IScaleGeneratorsFactory {
  getGenerator(zoom: ITimelineZoom): IScaleGenerator;
}

export class ScaleGeneratorsFactory implements IScaleGeneratorsFactory {
    private generatorsDictionary = {
        [TimelineDivisionType.Day]: new DayScaleGenerator(),
        [TimelineDivisionType.Week]: new WeekScaleGenerator(),
        [TimelineDivisionType.Month]: new MonthScaleGenerator(),
    };

    getGenerator(zoom: ITimelineZoom): IScaleGenerator {
        return this.generatorsDictionary[zoom.division];
    }
}



