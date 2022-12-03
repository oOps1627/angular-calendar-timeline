import { TimelineDivisionType } from '../models';
import { IDivisionAdaptor } from './models';
import { TimelineDaysDivisionAdaptor } from './days-division-adaptor';
import { TimelineWeeksDivisionAdaptor } from './weeks-division-adaptor';
import { TimelineMonthsDivisionAdaptor } from './months-division-adaptor';
import { InjectionToken } from "@angular/core";

export interface ITimelineDivisionsAdaptorsFactory<Division = TimelineDivisionType> {
  getAdaptor(division: Division): IDivisionAdaptor;
}

export const DIVISIONS_ADAPTORS_FACTORY = new InjectionToken<ITimelineDivisionsAdaptorsFactory>('DivisionsAdaptorsFactory');

export class TimelineDivisionsAdaptorsFactory implements ITimelineDivisionsAdaptorsFactory {
    private calculatorsDictionary = {
        [TimelineDivisionType.Day]: new TimelineDaysDivisionAdaptor(),
        [TimelineDivisionType.Week]: new TimelineWeeksDivisionAdaptor(),
        [TimelineDivisionType.Month]: new TimelineMonthsDivisionAdaptor(),
    };

    getAdaptor(division: TimelineDivisionType): IDivisionAdaptor {
        return this.calculatorsDictionary[division];
    }
}
