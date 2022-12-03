import { TimelineDivisionType } from '../models';
import { DaysDivisionAdaptor } from './days-division-adaptor';
import { WeeksDivisionAdaptor } from './weeks-division-adaptor';
import { MonthsDivisionAdaptor } from './months-division-adaptor';
import { IDivisionAdaptor } from "./base-divisions-adaptor";

export interface ITimelineDivisionsAdaptorsManager<Division = TimelineDivisionType> {
  getAdaptor(division: Division): IDivisionAdaptor;
}

export class DefaultTimelineDivisionsAdaptorsManager implements ITimelineDivisionsAdaptorsManager {
    private calculatorsDictionary = {
        [TimelineDivisionType.Day]: new DaysDivisionAdaptor(),
        [TimelineDivisionType.Week]: new WeeksDivisionAdaptor(),
        [TimelineDivisionType.Month]: new MonthsDivisionAdaptor(),
    };

    getAdaptor(division: TimelineDivisionType): IDivisionAdaptor {
        return this.calculatorsDictionary[division];
    }
}

export class TimelineDivisionsAdaptorsManager extends DefaultTimelineDivisionsAdaptorsManager {
}

