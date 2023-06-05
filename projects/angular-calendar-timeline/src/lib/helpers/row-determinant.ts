import { IItemsIterator, ITimelineItem } from "../models";

interface IRow {
  items: ITimelineItem[];
  stream: ITimelineItem;
}

export class RowDeterminant {
  rows: IRow[];

  constructor(private _itemsIterator: IItemsIterator) {
    this._generateMap();
  }

  private _generateMap(): void {
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
    this.rows = map;
  }

  getRowIndexByItem(item: ITimelineItem): number {
    let index;

    for (let i = 0; i < this.rows.length; i++) {
      const group = this.rows[i];

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

  getStreamByRowIndex(index: number): ITimelineItem | undefined {
    return this.rows[index]?.stream;
  }
}

