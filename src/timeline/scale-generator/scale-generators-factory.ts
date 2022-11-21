import { ITimelineZoom, TimelineDivisionType } from '../models';
import { IScaleGenerator } from './models';
import { MonthScaleGenerator } from './month-scale-generator';
import { WeekScaleGenerator } from './week-scale-generator';
import { DayScaleGenerator } from './day-scale-generator';

export class ScaleGeneratorsFactory {
    private generatorsDictionary = {
        [TimelineDivisionType.Day]: new DayScaleGenerator(),
        [TimelineDivisionType.Week]: new WeekScaleGenerator(),
        [TimelineDivisionType.Month]: new MonthScaleGenerator(),
    };

    getGenerator(zoom: ITimelineZoom): IScaleGenerator {
        return this.generatorsDictionary[zoom.division];
    }
}



