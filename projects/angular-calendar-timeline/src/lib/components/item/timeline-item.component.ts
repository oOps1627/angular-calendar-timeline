import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';
import { ResizeEvent } from "angular-resizable-element";
import { DragEndEvent } from "angular-draggable-droppable/lib/draggable.directive";
import { ITimelineItem, IScale } from "../../models";

@Component({
  selector: 'timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrls: ['./timeline-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineItemComponent {
  private _item: ITimelineItem;

  private _scale: IScale;

  isInScaleRange = true;

  isItemResizingStarted = false;

  @Input() set item(item: ITimelineItem | undefined) {
    this._item = item;
    item.updateView = () => this._cdr.detectChanges();
    this._checkIsInScaleRange();
  };

  @Input() set scale(scale: IScale | undefined) {
    this._scale = scale;
    this._checkIsInScaleRange();
  };

  @Input() height: number;

  @Input() locale: string;

  @Input() contentTemplate: TemplateRef<{ $implicit: ITimelineItem, locale: string }> | undefined;

  @Output() itemResized = new EventEmitter<{ event: ResizeEvent, item: ITimelineItem }>();

  @Output() itemMoved = new EventEmitter<{ event: DragEndEvent, item: ITimelineItem }>();

  get item(): ITimelineItem {
    return this._item;
  }

  constructor(private _cdr: ChangeDetectorRef) {
  }

  onItemResizeStart(event: ResizeEvent): void {
    this.isItemResizingStarted = true;
  }

  onItemResizeEnd(event: ResizeEvent): void {
    this.itemResized.emit({event, item: this._item});
    setTimeout(() => this.isItemResizingStarted = false);
  }

  onItemDropped(event: DragEndEvent): void {
    if (!this.isItemResizingStarted) {
      this.itemMoved.emit({event, item: this._item});
    }
  }

  private _checkIsInScaleRange(): void {
    if (!this._item || !this._scale) {
      return;
    }

    if (!this._item.startDate || !this._item.endDate) {
      this.isInScaleRange = true;
      return;
    }

    this.isInScaleRange = this._scale.startDate.getTime() <= this._item.startDate.getTime()
      && this._scale.endDate.getTime() >= this._item.endDate.getTime();
  }
}
