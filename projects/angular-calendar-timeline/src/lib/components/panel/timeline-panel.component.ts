import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef
} from "@angular/core";
import { ResizeEvent } from "angular-resizable-element";
import { ITimelineItem, IIdObject } from "../../models";

@Component({
  selector: 'timeline-panel',
  templateUrl: 'timeline-panel.component.html',
  styleUrls: ['timeline-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelinePanelComponent implements OnChanges {
  @Input() items: ITimelineItem[] = [];

  @Input() label: string;

  @Input() width: number;

  @Input() resizable: boolean;

  @Input() minWidth: number;

  @Input() maxWidth: number;

  @Input() headerHeight: number;

  @Input() rowHeight: number;

  @Input() locale: string;

  @Input() childGroupOffset: number = 15;

  @Input() itemTemplate: TemplateRef<{ item: ITimelineItem, index: number, depth: number, locale: string }>

  @Output() widthChanged = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.keys(changes).some(key => ['width', 'minWidth', 'maxWidth'].includes(key))) {
      this._validateWidth();
    }
  }

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
    item.childrenItemsExpanded = !item.childrenItemsExpanded;
  }

  private _validateWidth(): void {
    if (this.width < this.minWidth) {
      this.width = this.minWidth;
    }

    if (this.width > this.maxWidth) {
      this.width = this.maxWidth;
    }
  }
}
