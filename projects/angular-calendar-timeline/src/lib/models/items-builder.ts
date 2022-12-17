import { ITimelineItem } from "./item";

export interface IItemsBuilder {
  readonly items: ITimelineItem[];

  setItems(items: ITimelineItem[]): void;

  isEmpty(): boolean;

  forEach(handler: (item: ITimelineItem, parent: ITimelineItem | null) => void): void;

  getFirstItem(onlyExpanded: boolean): ITimelineItem;

  getLastItem(onlyExpanded: boolean): ITimelineItem;
}
