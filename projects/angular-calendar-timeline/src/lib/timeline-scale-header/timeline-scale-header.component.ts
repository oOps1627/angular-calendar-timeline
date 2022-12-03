import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IIdObject, ITimelineZoom } from '../models';
import { IScale, IScaleColumn, IScaleGroup } from '../scale-generator/models';
import { IScaleFormatter } from "../formatters/scale-formatter.interface";

@Component({
  selector: 'app-timeline-scale-header',
  templateUrl: 'timeline-scale-header.component.html',
  styleUrls: ['timeline-scale-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineScaleHeaderComponent {
  @Input() height: number;

  @Input() scale: IScale;

  @Input() formatter: IScaleFormatter;

  @Input() locale: string;

  @Input() zoom: ITimelineZoom;

  get headerGroups(): IScaleGroup[] {
    return this.scale?.groups ?? [];
  }

  get columns(): IScaleColumn[] {
    return this.scale?.columns ?? [];
  }

  trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }
}
