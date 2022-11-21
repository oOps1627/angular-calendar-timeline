import { TimelineDivisionType } from '../models';
import { ITimelineDivisionCalculator } from './models';
import { TimelineDaysDivisionCalculator } from './days-division-calculator';
import { TimelineWeeksDivisionCalculator } from './weeks-division-calculator';
import { TimelineMonthsDivisionCalculator } from './months-division-calculator';
import { InjectionToken } from "@angular/core";

export interface ITimelineDivisionsCalculatorFactory<Division = TimelineDivisionType> {
  getDivisionCalculator(division: Division): ITimelineDivisionCalculator;
}

export const DIVISIONS_CALCULATOR_FACTORY = new InjectionToken<ITimelineDivisionsCalculatorFactory>('DivisionsCalculatorFactory');

export class TimelineDivisionsCalculatorFactory implements ITimelineDivisionsCalculatorFactory {
    private calculatorsDictionary = {
        [TimelineDivisionType.Day]: new TimelineDaysDivisionCalculator(),
        [TimelineDivisionType.Week]: new TimelineWeeksDivisionCalculator(),
        [TimelineDivisionType.Month]: new TimelineMonthsDivisionCalculator(),
    };

    getDivisionCalculator(division: TimelineDivisionType): ITimelineDivisionCalculator {
        return this.calculatorsDictionary[division];
    }
}
