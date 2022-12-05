import { IItemsBuilder } from "./items-builder.interface";
import { ITimelineItem } from "angular-calendar-timeline";

export class ItemsBuilder implements IItemsBuilder {
  private _items: ITimelineItem[] = [];

  get items(): ITimelineItem[] {
    return this._items;
  }

  setItems(items: ITimelineItem[]) {
    this._items = items;
    this._sort();
  }

  isEmpty(): boolean {
    return !this._items?.length;
  }

  getFirstItem(onlyExpanded: boolean): ITimelineItem {
    let firstItem = this._items[0];

    this.forEach((item, parent) => {
      if (onlyExpanded && (parent && !parent?.expanded))
        return;

      if (new Date(firstItem.startDate).getTime() > new Date(item.startDate).getTime()) {
        firstItem = item;
      }
    });

    return firstItem;
  }

  getLastItem(onlyExpanded: boolean): ITimelineItem {
    let lastItem = this._items[0];

    this.forEach((item, parent) => {
      if (onlyExpanded && (parent && !parent?.expanded))
        return;

      if (new Date(lastItem.endDate).getTime() < new Date(item.endDate).getTime()) {
        lastItem = item;
      }
    });

    return lastItem;
  }

  forEach(handler: (item: ITimelineItem, parent: (ITimelineItem | null)) => void): void {
    function iterateAll(items: ITimelineItem[], parent: ITimelineItem | null): void {
      (items || []).forEach(item => {
        handler(item, parent);
        if (item.items) {
          iterateAll(item.items, item);
        }
      });
    }

    iterateAll(this._items, null);
  }

  private _sort(): void {
    this.forEach((item: ITimelineItem) => () => {
      (item.items ?? []).sort((a, b) => {
        return new Date(a.startDate).getTime() > new Date(b.startDate).getTime() ? 1 : -1;
      });
    });
  }
}
