import { AfterViewInit, Component, Input } from '@angular/core';
import { TimelineComponent } from "angular-calendar-timeline";
import { CustomViewMode, TimelineZoom } from "../custom-strategy";

@Component({
  selector: 'app-timeline-zoom',
  templateUrl: 'timeline-zoom.component.html',
  styleUrls: ['./timeline-zoom.component.scss'],
})
export class TimelineZoomComponent implements AfterViewInit {
  @Input() timelineComponent: TimelineComponent<CustomViewMode>;

  ngAfterViewInit(): void {
    const customZoom: TimelineZoom = {columnWidth: 60, viewMode: CustomViewMode.Month};
    this.timelineComponent!.changeZoom(customZoom);
  }

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



