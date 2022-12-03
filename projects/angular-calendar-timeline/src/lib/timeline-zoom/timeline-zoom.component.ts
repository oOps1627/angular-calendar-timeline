import { Component } from '@angular/core';
import { DefaultZooms } from "../zooms";
import { ZoomService } from "../zoom.service";

@Component({
    selector: 'app-timeline-zoom',
    templateUrl: 'timeline-zoom.component.html',
    styleUrls: ['./timeline-zoom.component.scss'],
})
export class TimelineZoomComponent {
    constructor(private _zoomService: ZoomService) {
    }

    zoomIn(): void {
       this._zoomService.zoomIn();
    }

    zoomOut(): void {
        this._zoomService.zoomOut();
    }

    onSliderChange(index: number): void {
        this._zoomService.changeZoom(DefaultZooms[index]);
    }

    scrollToToday(): void {
      // TODO: fix autoscroll
        this._zoomService.zoomFullIn();
    }

    zoomAndFitToContent(): void {
        this._zoomService.fitToContent();
    }
}



