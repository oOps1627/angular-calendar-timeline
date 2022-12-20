import { Component, Input } from '@angular/core';
import { DefaultZooms, TimelineComponent } from "angular-calendar-timeline";

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

  scrollToToday(): void {
    this.timelineComponent.zoomFullIn();
    this.timelineComponent.attachCameraToDate(new Date());
  }

  zoomAndFitToContent(): void {
    this.timelineComponent.fitToContent(15);
  }
}



