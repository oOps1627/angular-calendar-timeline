import { TimelineDivisionType } from '../models';
import { TimelineDaysDivisionAdaptor } from './days-division-adaptor';
import { TimelineWeeksDivisionAdaptor } from './weeks-division-adaptor';
import { TimelineMonthsDivisionAdaptor } from './months-division-adaptor';
import { InjectionToken } from "@angular/core";
import { IDivisionAdaptor } from "./base-divisions-adaptor";

export interface ITimelineDivisionsAdaptorsManager<Division = TimelineDivisionType> {
  getAdaptor(division: Division): IDivisionAdaptor;
}

export const DIVISIONS_ADAPTORS_MANAGER = new InjectionToken<ITimelineDivisionsAdaptorsManager>('DivisionsAdaptorsFactory');

export class TimelineDivisionsAdaptorsManager implements ITimelineDivisionsAdaptorsManager {
    private calculatorsDictionary = {
        [TimelineDivisionType.Day]: new TimelineDaysDivisionAdaptor(),
        [TimelineDivisionType.Week]: new TimelineWeeksDivisionAdaptor(),
        [TimelineDivisionType.Month]: new TimelineMonthsDivisionAdaptor(),
    };

    getAdaptor(division: TimelineDivisionType): IDivisionAdaptor {
        return this.calculatorsDictionary[division];
    }
}
