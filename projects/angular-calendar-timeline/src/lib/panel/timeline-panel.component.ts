import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import { IIdObject, ITimelineItem } from "../models";
import { ResizeEvent } from "angular-resizable-element";

@Component({
  selector: 'timeline-panel',
  templateUrl: 'timeline-panel.component.html',
  styleUrls: ['timeline-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelinePanelComponent {
  readonly minPanelWidth = 50;

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
      this.width = newWidth < this.minPanelWidth ? this.minPanelWidth : newWidth;
      this.widthChanged.emit(this.width);
    }
  }

  toggleExpand(item: ITimelineItem): void {
    item.expanded = !item.expanded;
  }
}
