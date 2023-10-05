import { ITimelineItem } from "./item";

export interface IItemsIterator {
  readonly items: ITimelineItem[];

  setItems(items: ITimelineItem[]): void;

  isEmpty(): boolean;

  forEach(handler: (item: ITimelineItem, parent: ITimelineItem | null, onlyVisible?: boolean) => void): void;

  getFirstItem(onlyExpanded: boolean): ITimelineItem;

  getLastItem(onlyExpanded: boolean): ITimelineItem;
}
