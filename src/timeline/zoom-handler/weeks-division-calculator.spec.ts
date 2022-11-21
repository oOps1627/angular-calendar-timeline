import { TimelineWeeksDivisionCalculator } from './weeks-division-calculator';

describe('TimelineWeeksDivisionCalculator', () => {
    let handler: TimelineWeeksDivisionCalculator;

    beforeEach(() => {
        handler = new TimelineWeeksDivisionCalculator();
    });

  it('Midway time between between 18.11.2022 and 19.11.2022 should be 17.11.2022', () => {
    const firstDate = new Date(2022, 10, 18);
    const secondDate = new Date(2022, 10, 19);
    const midwayDate = new Date(handler.getTimeInDivisionsCenter(firstDate, secondDate));
    expect(midwayDate.getDate()).toEqual(17);
  });

    it('Count of unique weeks between 15.12.2021 and 16.12.2021 should be 1', () => {
        const firstDate = new Date(2021, 11, 15);
        const secondDate = new Date(2021, 11, 16);
        const countOfDays = handler.getUniqueDivisionsCountBetweenDates(firstDate, secondDate);
        expect(countOfDays).toEqual(1);
    });

    it('Count of unique weeks between 15.12.2021 and 20.12.2021 should be 2', () => {
        const firstDate = new Date(2021, 11, 15);
        const secondDate = new Date(2021, 11, 20);
        const countOfDays = handler.getUniqueDivisionsCountBetweenDates(firstDate, secondDate);
        expect(countOfDays).toEqual(2);
    });

    it('Time duration in weeks between 14.12.2021 and 21.12.2021 should be 1', () => {
        const firstDate = new Date(2021, 11, 14, 0, 0, 0, 0);
        const secondDate = new Date(2021, 11, 21, 0, 0, 0, 0);
        const countOfDays = handler.getDurationInDivisions(firstDate, secondDate);
        expect(countOfDays).toEqual(1);
    });
});
