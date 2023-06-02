import { IItemsIterator, ITimelineItem } from "angular-calendar-timeline";

interface IRow {
  items: ITimelineItem[];
  stream: ITimelineItem;
}

export class RowsMap {
  map: IRow[];

  constructor(private _itemsIterator: IItemsIterator) {
    this.generateMap();
  }

  generateMap(): void {
    const map: IRow[] = [];
    const iterate = (items: ITimelineItem[]): void => {
      (items ?? []).forEach(item => {
        if (item.streamItems) {
          item._streamLevels.forEach((levelArr, index) => {
            map.push({stream: item, items: levelArr})
          });
        } else {
          map.push({stream: item, items: [item]});
        }

        if (item.childrenItemsExpanded) {
          iterate(item.childrenItems ?? []);
        }
      });
    }

    iterate(this._itemsIterator.items);
    this.map = map;
  }

  getRowIndexByItem(item: ITimelineItem): number {
    let index;

    for (let i = 0; i < this.map.length; i++) {
      const group = this.map[i];

      if (item.id === group.stream.id) {
        index = i;
        break;
      }

      const hasChild = group.items.find(i => i.id === item.id);
      if (hasChild) {
        index = i;
      }
    }

    return index;
  }

  getStreamByRowIndex(index: number): ITimelineItem {
    console.log(index, this.map);
    return this.map[index].stream;
  }
}

export function findGroupByVerticalPosition(itemsIterator: IItemsIterator, position: number, rowHeight: number): ITimelineItem {
  const index = Math.ceil(position / rowHeight);
  const visibleItems: ITimelineItem[] = [];

  function iterate(items: ITimelineItem[]): void {
    (items ?? []).forEach(item => {
      if (item.streamItems) {
        item._streamLevels.forEach(() => visibleItems.push(item));
      } else {
        visibleItems.push(item);
      }
      if (item.childrenItemsExpanded) {
        iterate(item.childrenItems ?? []);
      }
    });
  }

  iterate(itemsIterator.items);

  return visibleItems[index];
}

function findGroupByItem(itemsIterator: IItemsIterator, item: ITimelineItem) {
  const items = itemsIterator.items;


}
