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
  private _zoom: ITimelineZoom;
  public columnNameMode: keyof Pick<IScaleColumn, 'shortName' | 'longName' | 'name'>;

  @Input() height: number;
  @Input() scale: IScale;

  @Input() set zoom(zoom: ITimelineZoom | undefined) {
    this._zoom = zoom;
    this._setNameMode();
  }

  get zoom(): ITimelineZoom {
    return this._zoom;
  }

  get headerGroups(): IScaleGroup[] {
    return this.scale?.groups ?? [];
  }

  get columns(): IScaleColumn[] {
    return this.scale?.columns ?? [];
  }

  trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }

  private _setNameMode(): void {
    if (this._zoom.columnWidth < 65)
      this.columnNameMode = 'shortName';
    else if (this._zoom.columnWidth > 180)
      this.columnNameMode = 'longName';
    else
      this.columnNameMode = 'name';
  }
}
