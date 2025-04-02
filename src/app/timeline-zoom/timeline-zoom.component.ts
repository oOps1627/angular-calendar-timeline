import { AfterViewInit, Component, Input } from '@angular/core';
import { TimelineComponent } from "angular-calendar-timeline";
import { CustomViewMode } from "../custom-strategy";

@Component({
  selector: 'app-timeline-zoom',
  templateUrl: 'timeline-zoom.component.html',
  styleUrls: ['./timeline-zoom.component.scss'],
})
export class TimelineZoomComponent implements AfterViewInit {
  minZoomIndex: number;
  maxZoomIndex: number;
  currentZoomIndex: number;

  @Input() timelineComponent: TimelineComponent<CustomViewMode>;

  ngAfterViewInit(): void {
    this.minZoomIndex = this.timelineComponent.zoomsHandler.getFirstZoom().index;
    this.maxZoomIndex = this.timelineComponent.zoomsHandler.getLastZoom().index;

    this.timelineComponent.zoomsHandler.activeZoom$
      .subscribe((zoom) => this.currentZoomIndex = zoom.index);

    this.zoomAndFitToContent();
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

  changeZoom(event: Event): void {
    this.timelineComponent.changeZoomByIndex(+(event.target as HTMLInputElement).value);
  }
}



