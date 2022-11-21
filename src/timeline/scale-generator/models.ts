import { IIdObject } from "../models";

export interface IScaleColumn extends IIdObject {
    name: string;
    date: Date;
    shortName?: string;
    longName?: string;
}

export interface IScaleHeaderGroup extends IIdObject {
    name: string;
    columnsCount: number;
    date: Date;
}

export interface IScale {
    headerGroups: IScaleHeaderGroup[];
    columns: IScaleColumn[];
}

export interface IScaleGenerator {
    getScale(startDate: Date, endDate: Date): IScale;

    validateStartDate(date: Date): Date;

    validateEndDate(date: Date): Date;
}
