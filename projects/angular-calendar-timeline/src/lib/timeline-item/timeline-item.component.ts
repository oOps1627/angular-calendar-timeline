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
import { ITimelineItem } from "../models/item";

@Component({
  selector: 'app-timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrls: ['./timeline-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineItemComponent {
  private _item: ITimelineItem;

  isItemResizingStarted = false;

  @Input() set item(item: ITimelineItem | undefined) {
    this._item = item;

    if (item) {
      item._redraw = () => this._cdr.detectChanges();
    }
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
    this.itemResized.emit({event, item: this.item});
    setTimeout(() =>  this.isItemResizingStarted = false);
  }

  onItemDropped(event: DragEndEvent): void {
    if (!this.isItemResizingStarted) {
      this.itemMoved.emit({event, item: this.item});
    }
  }
}
