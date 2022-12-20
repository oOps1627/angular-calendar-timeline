import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IIdObject, ITimelineZoom, IScale, IScaleColumn, IScaleFormatter, IScaleGroup } from "../../models";

interface IGeneratedGroup {
  id: string;

  name: string;

  width: number;
}

@Component({
  selector: 'timeline-scale-header',
  templateUrl: 'timeline-scale-header.component.html',
  styleUrls: ['timeline-scale-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineScaleHeaderComponent implements OnChanges {
  @Input() height: number;

  @Input() scale: IScale;

  @Input() formatter: IScaleFormatter;

  @Input() locale: string;

  @Input() zoom: ITimelineZoom;

  public groups: IGeneratedGroup[] = [];

  get columns(): IScaleColumn[] {
    return this.scale?.columns ?? [];
  }

  ngOnChanges(changes: SimpleChanges) {
    this._generateGroups();
  }

  trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }

  private _groupColumnGroups(): { [groupId: string]: IScaleGroup[] } {
    return this.scale.columns.reduce((groupsMap, column) => {
      column.groups.forEach(group => {
        groupsMap[group.id] = groupsMap[group.id] ?? [];
        groupsMap[group.id].push(group);
      });

      return groupsMap;
    }, {})
  }

  private _generateGroups(): void {
    const groupedGroups = this._groupColumnGroups();

    this.groups = Object.keys(groupedGroups).map(groupId => ({
      id: groupId,
      name: this.formatter.formatGroup(groupedGroups[groupId][0], this.locale),
      width: groupedGroups[groupId].reduce((acc, curr) => acc + this.zoom.columnWidth * curr.coverageInPercents / 100, 0)
    }));
  }
}


