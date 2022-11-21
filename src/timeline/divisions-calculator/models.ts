export interface ITimelineDivisionCalculator {
    getTimeInDivisionsCenter(startDate: Date, endDate: Date): number;

    getUniqueDivisionsCountBetweenDates(startDate: Date, endDate: Date): number;

    getDurationInDivisions(startDate: Date, endDate: Date): number;

    addDivisionToDate(date: Date, units: number): Date;
}
