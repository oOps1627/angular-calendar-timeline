import { DaysDivisionAdaptor } from './days-division-adaptor';
import { WeeksDivisionAdaptor } from './weeks-division-adaptor';
import { MonthsDivisionAdaptor } from './months-division-adaptor';
import { IDivisionAdaptor } from "./base-divisions-adaptor";
import { TimelineDivisionType } from "../models";

export interface IDivisionsAdaptorsManager<Division = TimelineDivisionType> {
  getAdaptor(division: Division): IDivisionAdaptor;
}

export class DefaultDivisionsAdaptorsManager implements IDivisionsAdaptorsManager {
  protected calculatorsDictionary = {
        [TimelineDivisionType.Day]: new DaysDivisionAdaptor(),
        [TimelineDivisionType.Week]: new WeeksDivisionAdaptor(),
        [TimelineDivisionType.Month]: new MonthsDivisionAdaptor(),
    };

    getAdaptor(division: TimelineDivisionType): IDivisionAdaptor {
        return this.calculatorsDictionary[division];
    }
}

export class DivisionsAdaptorsManager extends DefaultDivisionsAdaptorsManager {
}

