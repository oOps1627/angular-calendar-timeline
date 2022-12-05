import { Component, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import { IIdObject, ITimelineItem } from "angular-calendar-timeline";
import { ResizeEvent } from "angular-resizable-element";

@Component({
  selector: 'timeline-panel',
  templateUrl: 'timeline-panel.component.html',
  styleUrls: ['timeline-panel.component.scss']
})
export class TimelinePanelComponent {
  @Input() items: ITimelineItem[];

  @Input() label: string;

  @Input() width: number;

  @Input() headerHeight: number;

  @Input() rowHeight: number;

  @Input() locale: string;

  @Input() itemTemplate: TemplateRef<{item: ITimelineItem, index: number, depth: number, locale: string}>

  @Output() widthChanged = new EventEmitter<number>();

  trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }

  handleResize(event: ResizeEvent) {
    const newWidth = event.rectangle.width;

    if (newWidth) {
      this.width = newWidth < 50 ? 50 : newWidth;
      this.widthChanged.emit(this.width);
    }
  }

  toggleExpand(item: ITimelineItem): void {
    item.expanded = !item.expanded;
  }
}
