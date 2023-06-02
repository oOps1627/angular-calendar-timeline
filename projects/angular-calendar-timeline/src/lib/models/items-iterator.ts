import { ITimelineItem } from "./item";

export interface IItemsIterator {
  readonly items: ITimelineItem[];

  setItems(items: ITimelineItem[]): void;

  isEmpty(): boolean;

  forEach(handler: (item: ITimelineItem, parent: ITimelineItem | null) => void): void;

  forEachVisible(handler: (item: ITimelineItem, parent: ITimelineItem | null) => void): void;

  getFirstItem(onlyExpanded: boolean): ITimelineItem;

  getLastItem(onlyExpanded: boolean): ITimelineItem;
}
