import { MonthsViewModeAdaptor } from './months-view-mode-adaptor';

describe('MonthsViewModeAdaptor', () => {
  let viewModeAdaptor: MonthsViewModeAdaptor;

  beforeEach(() => {
    viewModeAdaptor = new MonthsViewModeAdaptor();
  });

  it('Midway time between between 18.11.2022 and 19.11.2022 should be 15.11.2022', () => {
    const firstDate = new Date(2022, 10, 18);
    const secondDate = new Date(2022, 10, 19);
    const midwayDate = new Date(viewModeAdaptor.getMiddleDate(firstDate, secondDate));

    expect(midwayDate.getDate()).toEqual(16);
    expect(midwayDate.getHours()).toEqual(0);
    expect(midwayDate.getMonth()).toEqual(firstDate.getMonth());
  });

  it('Midway time between between 18.10.2022 and 18.11.2022 should be 30.10.2022 or 01.11.2022', () => {
    const firstDate = new Date(2022, 9, 18);
    const secondDate = new Date(2022, 10, 20);
    const midwayDate = new Date(viewModeAdaptor.getMiddleDate(firstDate, secondDate));

    expect([31, 1].includes(midwayDate.getDate())).toBeTrue();
    expect([9, 10].includes(midwayDate.getMonth())).toBeTrue();
  });

  it('Midway time in January 2022 should be middle of 16.01.2022', () => {
    const firstDate = new Date(2022, 0, 10);
    const secondDate = new Date(2022, 0, 13);
    const midwayDate = new Date(viewModeAdaptor.getMiddleDate(firstDate, secondDate));
    expect(midwayDate.getDate()).toEqual(16);
    expect(midwayDate.getHours()).toEqual(12);
  });

  it('Count of unique months between 31.12.2021 and 03.01.2022 should be 2', () => {
    const firstDate = new Date(2021, 11, 31);
    const secondDate = new Date(2022, 0, 3);
    const countOfDays = viewModeAdaptor.getUniqueColumnsWithinRange(firstDate, secondDate);
    expect(countOfDays).toEqual(2);
  });

  it('Count of unique months between 30.12.2021 and 31.01.2022 should be 1', () => {
    const firstDate = new Date(2022, 11, 30);
    const secondDate = new Date(2022, 11, 31);
    const countOfMonths = viewModeAdaptor.getUniqueColumnsWithinRange(firstDate, secondDate);
    expect(countOfMonths).toEqual(1);
  });

  it('Time duration in months between 01.01.2022 and 01.02.2022 should be close to 1', () => {
    const firstDate = new Date(2022, 0, 1, 0, 0, 0, 0);
    const secondDate = new Date(2022, 1, 1, 0, 0, 0, 0);
    const countOfMonths = viewModeAdaptor.getDurationInColumns(firstDate, secondDate);
    expect(countOfMonths).toBeCloseTo(1);
  });

  it('Time duration in months between 01.01.2022 and 01.05.2022 should be close to 4', () => {
    const firstDate = new Date(2022, 0, 1, 0, 0, 0, 0);
    const secondDate = new Date(2022, 4, 1, 0, 0, 0, 0);
    const countOfMonths = viewModeAdaptor.getDurationInColumns(firstDate, secondDate);
    expect(countOfMonths).toBeCloseTo(4);
  });

  it('Time duration in months between 31.12.2021 and 29.01.2022 should be less then 1', () => {
    const firstDate = new Date(2021, 11, 31);
    const secondDate = new Date(2022, 0, 1);
    const countOfMonths = viewModeAdaptor.getDurationInColumns(firstDate, secondDate);
    expect(countOfMonths).toBeLessThan(1);
  });

  it('Column should begins on 01.12.2023 when column date is in (01-31).12.2023 dates range', () => {
   const date = new Date(2023, 11, 30);
    const beginningDate = viewModeAdaptor.getBeginningDateOfColumn(date);
    expect(beginningDate.getDate()).toBe(1);
    expect(beginningDate.getMonth()).toBe(11);
    expect(beginningDate.getFullYear()).toBe(2023);
  });

  it('Column should ends on 31.12.2023 when column date is in (01-31).12.2023 dates range', () => {
    const date = new Date(2023, 11, 30);
    const beginningDate = viewModeAdaptor.getEndingDateOfColumn(date);
    expect(beginningDate.getDate()).toBe(31);
    expect(beginningDate.getMonth()).toBe(11);
    expect(beginningDate.getFullYear()).toBe(2023);
  });
});
