import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IIdObject, ITimelineZoom } from '../models';
import { IScale, IScaleColumn, IScaleHeaderGroup } from '../scale-generator/models';

@Component({
  selector: 'app-timeline-scale-header',
  templateUrl: 'timeline-scale-header.component.html',
  styleUrls: ['timeline-scale-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineScaleHeaderComponent {
  @Input() zoom: ITimelineZoom | undefined;
  @Input() columnWidth: number = 0;
  @Input() scale: IScale;

  get headerGroups(): IScaleHeaderGroup[] {
    return this.scale?.headerGroups ?? [];
  }

  get columns(): IScaleColumn[] {
    return this.scale?.columns ?? [];
  }

  getColumnName(column: IScaleColumn): string {
    if (this.columnWidth < 65 && column.shortName)
      return column.shortName;

    if (this.columnWidth > 180 && column.longName)
      return column.longName;

    return column.name;
  }

  trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }
}
