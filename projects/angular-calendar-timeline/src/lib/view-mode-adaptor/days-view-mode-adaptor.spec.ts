import { DaysViewModeAdaptor } from './days-view-mode-adaptor';

describe('DaysViewModeAdaptor', () => {
  let viewModeAdaptor: DaysViewModeAdaptor;

  beforeEach(() => {
    viewModeAdaptor = new DaysViewModeAdaptor();
  });

  it('Midway time between between 18.11.2022 and 20.11.2022 should be 19.11.2022', () => {
    const firstDate = new Date(2022, 10, 18);
    const secondDate = new Date(2022, 10, 20);
    const midwayDate = new Date(viewModeAdaptor.getMiddleDate(firstDate, secondDate));

    expect(midwayDate.getDate()).toEqual(19);
  });

  it('Midway time between between 18.11.2022 and 19.11.2022 should be beginning of 19.11.2022', () => {
    const firstDate = new Date(2022, 10, 18);
    const secondDate = new Date(2022, 10, 19);
    const midwayDate = new Date(viewModeAdaptor.getMiddleDate(firstDate, secondDate));

    expect(midwayDate.getDate()).toEqual(19);
  });

  it('Hours of average date between start and end dates should be 12', () => {
    const firstDate = new Date();
    const secondDate = new Date();
    expect(new Date(viewModeAdaptor.getMiddleDate(firstDate, secondDate)).getHours()).toEqual(12);
  });

  it('Count of unique days between 31.12.2021 and 03.01.2022 should be 4', () => {
    const firstDate = new Date(2021, 11, 31);
    const secondDate = new Date(2022, 0, 3);
    const countOfDays = viewModeAdaptor.getUniqueColumnsWithinRange(firstDate, secondDate);
    expect(countOfDays).toEqual(4);
  });

  it('Count of unique days between the same dates should be 1', () => {
    const firstDate = new Date(2022, 11, 31);
    const secondDate = new Date(2022, 11, 31, 2);
    const countOfDays = viewModeAdaptor.getUniqueColumnsWithinRange(firstDate, secondDate);
    expect(countOfDays).toEqual(1);
  });

  it('Time duration in days between 31.12.2021 00:00 and 01.01.2022 00:00 should be 1', () => {
    const firstDate = new Date(2021, 11, 31, 0, 0, 0, 0);
    const secondDate = new Date(2022, 0, 1, 0, 0, 0, 0);
    const countOfDays = viewModeAdaptor.getDurationInColumns(firstDate, secondDate);
    expect(countOfDays).toEqual(1);
  });

  it('Time duration in days between 31.12.2021 12:00 and 01.01.2022 11:00 should be less then 1', () => {
    const firstDate = new Date(2021, 11, 31, 12, 0, 0, 0);
    const secondDate = new Date(2022, 0, 1, 11, 0, 0, 0);
    const countOfDays = viewModeAdaptor.getDurationInColumns(firstDate, secondDate);
    expect(countOfDays).toBeLessThan(1);
  });

  it('Column should begins at 00:00', () => {
    const date = new Date(2023, 11, 30);
    const beginningDate = viewModeAdaptor.getBeginningDateOfColumn(date);
    expect(beginningDate.getHours()).toBe(0);
    expect(beginningDate.getMinutes()).toBe(0);
    expect(beginningDate.getDate()).toBe(30);
    expect(beginningDate.getMonth()).toBe(11);
    expect(beginningDate.getFullYear()).toBe(2023);
  });

  it('Column should ends at 23:59', () => {
    const date = new Date(2023, 11, 30);
    const beginningDate = viewModeAdaptor.getEndingDateOfColumn(date);
    expect(beginningDate.getHours()).toBe(23);
    expect(beginningDate.getMinutes()).toBe(59);
    expect(beginningDate.getDate()).toBe(30);
    expect(beginningDate.getMonth()).toBe(11);
    expect(beginningDate.getFullYear()).toBe(2023);
  });
});
