import { WeeksViewModeAdaptor } from './weeks-view-mode-adaptor';

describe('WeeksViewModeAdaptor', () => {
  let viewModeAdaptor: WeeksViewModeAdaptor;

  beforeEach(() => {
    viewModeAdaptor = new WeeksViewModeAdaptor();
  });

  it('Midway time between between 18.11.2022 and 19.11.2022 should be 17.11.2022', () => {
    const firstDate = new Date(2022, 10, 18);
    const secondDate = new Date(2022, 10, 19);
    const midwayDate = new Date(viewModeAdaptor.getMiddleDate(firstDate, secondDate));
    expect(midwayDate.getDate()).toEqual(17);
  });


  it('Count of unique weeks between 06.06.2021 and 01.07.2021 should be 4', () => {
    const firstDate = new Date('2021-06-06T21:00:00.000Z');
    const secondDate = new Date('2021-07-01T18:00:00.000Z');
    const countOfDays = viewModeAdaptor.getUniqueColumnsWithinRange(firstDate, secondDate);
    expect(countOfDays).toEqual(4);
  });

  it('Count of unique weeks between 15.12.2021 and 16.12.2021 should be 1', () => {
    const firstDate = new Date(2021, 11, 15);
    const secondDate = new Date(2021, 11, 16);
    const countOfWeeks = viewModeAdaptor.getUniqueColumnsWithinRange(firstDate, secondDate);
    expect(countOfWeeks).toEqual(1);
  });

  it('Count of unique weeks between 15.12.2021 and 20.12.2021 should be 2', () => {
    const firstDate = new Date(2021, 11, 15);
    const secondDate = new Date(2021, 11, 20);
    const countOfWeeks = viewModeAdaptor.getUniqueColumnsWithinRange(firstDate, secondDate);
    expect(countOfWeeks).toEqual(2);
  });

  it('Time duration in weeks between 14.12.2021 and 21.12.2021 should be 1', () => {
    const firstDate = new Date(2021, 11, 14, 0, 0, 0, 0);
    const secondDate = new Date(2021, 11, 21, 0, 0, 0, 0);
    const countOfWeeks = viewModeAdaptor.getDurationInColumns(firstDate, secondDate);
    expect(countOfWeeks).toEqual(1);
  });

  it('Column should begins on 05.06.2023 when date is 06.11.06.2023', () => {
    const date = new Date(2023, 5, 6);
    const beginningDate = viewModeAdaptor.getBeginningDateOfColumn(date);
    expect(beginningDate.getDate()).toBe(5);
    expect(beginningDate.getMonth()).toBe(5);
    expect(beginningDate.getFullYear()).toBe(2023);
  });

  it('Column should begins on 10.06.2024 when date is 10.06.2024', () => {
    const date = new Date(2024, 5, 10);
    const beginningDate = viewModeAdaptor.getBeginningDateOfColumn(date);
    expect(beginningDate.getDate()).toBe(10);
    expect(beginningDate.getMonth()).toBe(5);
    expect(beginningDate.getFullYear()).toBe(2024);
  });

  it('Column should ends on 11.06.2023 when date is in 07.06.2023', () => {
    const date = new Date(2023, 5, 7);
    const beginningDate = viewModeAdaptor.getEndingDateOfColumn(date);
    expect(beginningDate.getDate()).toBe(11);
    expect(beginningDate.getMonth()).toBe(5);
    expect(beginningDate.getFullYear()).toBe(2023);
  });

  it('Column should ends on 18.06.2023 when date is 17.06.2023', () => {
    const date = new Date(2023, 5, 17);
    const beginningDate = viewModeAdaptor.getEndingDateOfColumn(date);
    expect(beginningDate.getDate()).toBe(18);
    expect(beginningDate.getMonth()).toBe(5);
    expect(beginningDate.getFullYear()).toBe(2023);
  });

  it('Column should ends on 9.06.2024 when date is 9.06.2024', () => {
    const date = new Date(2024, 5, 9);
    const beginningDate = viewModeAdaptor.getEndingDateOfColumn(date);
    expect(beginningDate.getDate()).toBe(9);
    expect(beginningDate.getMonth()).toBe(5);
    expect(beginningDate.getFullYear()).toBe(2024);
  });
});
