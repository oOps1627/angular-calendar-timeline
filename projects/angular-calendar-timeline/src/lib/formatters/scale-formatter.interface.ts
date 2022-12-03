import { IScaleColumn, IScaleGroup } from "../scale-generator/models";

export interface IScaleFormatter {
  formatColumn(column: IScaleColumn, columnWidth: number, locale: string): string;

  formatGroup?(group: IScaleGroup, locale: string): string;
}
