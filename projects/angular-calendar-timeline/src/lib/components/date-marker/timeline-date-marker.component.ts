import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, TemplateRef } from '@angular/core';
import { IScale } from "angular-calendar-timeline";

@Component({
  selector: 'timeline-date-marker',
  templateUrl: './timeline-date-marker.component.html',
  styleUrls: ['./timeline-date-marker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineDateMarkerComponent {
  isInScaleRange: boolean = true;

  @Input() leftPosition: number = 0;

  @Input() headerHeight: number;

  @Input() customTemplate: TemplateRef<{ leftPosition: number }> | undefined;

  @Input() set scale(scale: IScale) {
    this._checkIsInScaleRange(scale);
  };

  constructor(private _cdr: ChangeDetectorRef) {
  }

  private _checkIsInScaleRange(scale: IScale): void {
    const now = Date.now();
    this.isInScaleRange = scale.startDate.getTime() <= now && scale.endDate.getTime() >= now;
    this._cdr.detectChanges();
  }
}
