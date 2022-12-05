import { Component, EventEmitter, Input, Output } from "@angular/core";
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

  @Output() widthChanged = new EventEmitter<number>();

  trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }

  handleResize(event: ResizeEvent) {
    if (event.rectangle.width) {
      this.width = event.rectangle.width;
      this.widthChanged.emit(this.width);
    }
  }

  toggleExpand(item: ITimelineItem): void {
    item.expanded = !item.expanded;
  }
}
