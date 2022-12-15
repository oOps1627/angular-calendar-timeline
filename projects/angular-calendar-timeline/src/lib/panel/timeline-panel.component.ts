import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import { ResizeEvent } from "angular-resizable-element";
import { ITimelineItem } from "../models/item";
import { IIdObject } from "../models/id-object";

@Component({
  selector: 'timeline-panel',
  templateUrl: 'timeline-panel.component.html',
  styleUrls: ['timeline-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelinePanelComponent {
  @Input() items: ITimelineItem[];

  @Input() label: string;

  @Input() width: number;

  @Input() resizable: boolean;

  @Input() minWidth: number;

  @Input() maxWidth: number;

  @Input() headerHeight: number;

  @Input() rowHeight: number;

  @Input() locale: string;

  @Input() itemTemplate: TemplateRef<{ item: ITimelineItem, index: number, depth: number, locale: string }>

  @Output() widthChanged = new EventEmitter<number>();

  trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }

  handleResize(event: ResizeEvent) {
    const newWidth = event.rectangle.width;

    if (newWidth < this.minWidth || newWidth > this.maxWidth)
      return;

    this.width = newWidth;
    this.widthChanged.emit(this.width);
  }

  toggleExpand(item: ITimelineItem): void {
    item.expanded = !item.expanded;
  }
}
