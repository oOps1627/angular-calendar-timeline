import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IIdObject, ITimelineZoom } from '../models';
import { IScale, IScaleColumn, IScaleGroup } from '../scale-generator/models';

@Component({
  selector: 'app-timeline-scale-header',
  templateUrl: 'timeline-scale-header.component.html',
  styleUrls: ['timeline-scale-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineScaleHeaderComponent {
  @Input() height: number;
  @Input() zoom: ITimelineZoom | undefined;
  @Input() scale: IScale;

  get headerGroups(): IScaleGroup[] {
    return this.scale?.groups ?? [];
  }

  get columns(): IScaleColumn[] {
    return this.scale?.columns ?? [];
  }

  getColumnName(column: IScaleColumn): string {
    if (this.zoom.columnWidth < 65 && column.shortName)
      return column.shortName;

    if (this.zoom.columnWidth > 180 && column.longName)
      return column.longName;

    return column.name;
  }

  trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }
}
