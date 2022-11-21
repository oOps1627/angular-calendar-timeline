import { TimelineZoomDivision } from '../models';
import { ITimelineDivisionCalculator } from './models';
import { TimelineDaysDivisionCalculator } from './days-division-calculator';
import { TimelineWeeksDivisionCalculator } from './weeks-division-calculator';
import { TimelineMonthsDivisionCalculator } from './months-division-calculator';

export class TimelineDivisionsCalculatorFactory {
    private calculatorsDictionary = {
        [TimelineZoomDivision.Day]: new TimelineDaysDivisionCalculator(),
        [TimelineZoomDivision.Week]: new TimelineWeeksDivisionCalculator(),
        [TimelineZoomDivision.Month]: new TimelineMonthsDivisionCalculator(),
    };

    getDivisionCalculator(division: TimelineZoomDivision): ITimelineDivisionCalculator {
        return this.calculatorsDictionary[division];
    }
}
