import { Component, Input } from '@angular/core';
import { DefaultZooms } from "../../../projects/angular-calendar-timeline/src/lib/zooms-builder/zooms";
import { TimelineComponent } from "../../../projects/angular-calendar-timeline/src/lib/timeline.component";

@Component({
  selector: 'app-timeline-zoom',
  templateUrl: 'timeline-zoom.component.html',
  styleUrls: ['./timeline-zoom.component.scss'],
})
export class TimelineZoomComponent {
  @Input() timelineComponent: TimelineComponent;

  zoomIn(): void {
    this.timelineComponent.zoomIn();
  }

  zoomOut(): void {
    this.timelineComponent.zoomOut();
  }

  onSliderChange(index: number): void {
    this.timelineComponent.changeZoom(DefaultZooms[index]);
  }

  scrollToToday(): void {
    this.timelineComponent.zoomFullIn();
    this.timelineComponent.attachCameraToDate(new Date());
  }

  zoomAndFitToContent(): void {
    this.timelineComponent.fitToContent(15);
  }
}



