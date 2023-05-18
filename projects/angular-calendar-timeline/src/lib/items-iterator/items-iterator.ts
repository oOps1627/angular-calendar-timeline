import { ITimelineItem, IItemsIterator } from "../models";

export class ItemsIterator implements IItemsIterator {
  private _items: ITimelineItem[] = [];

  get items(): ITimelineItem[] {
    return this._items;
  }

  setItems(items: ITimelineItem[]) {
    this._items = items;
    this._sort();
    this._createStreams();
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

  private _createStreams(): void {
    this.forEach((item, parent) => {
      if (item.stream) {
        item._streamLevels = this._createLevels(item.items);
      }
    });
  }

  private _createLevels(items: ITimelineItem[]): ITimelineItem[][] {
    const levels: ITimelineItem[][] = [];

    items.forEach(item => {
      let isLevelFound = false;
      let currentLevelIndex = 0;

      while (!isLevelFound) {
        const levelItems = levels[currentLevelIndex];
        if (!levelItems) {
          levels[currentLevelIndex] = [item];
          isLevelFound = true;
          break;
        }

        const isItemCollides = levelItems.some(levelItem => this._isItemsCollides(levelItem, item));

        if (!isItemCollides) {
          levels[currentLevelIndex].push(item);
          isLevelFound = true;
          break;
        }

        currentLevelIndex++;
      }
    })

    return levels;
  }

  private _isItemsCollides(item1: ITimelineItem, item2: ITimelineItem): boolean {
    const item1Start = item1._left;
    const item1End = item1._left + item1._width;
    const item2Start = item2._left;
    const item2End = item2._left + item2._width;

    return item1Start === item2Start || item1End === item2End ||
      item1End > item2Start && item1Start < item2End ||
      item2End > item1Start && item2Start < item1End;
  }

  private _sort(): void {
    this.forEach((item: ITimelineItem) => () => {
      (item.items ?? []).sort((a, b) => {
        return new Date(a.startDate).getTime() > new Date(b.startDate).getTime() ? 1 : -1;
      });
    });
  }
}
