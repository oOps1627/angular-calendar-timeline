import { Component, Input } from '@angular/core';
import { TimelineComponent } from '../timeline.component';
import { DefaultZooms } from "../zooms";

@Component({
    selector: 'app-timeline-zoom',
    templateUrl: 'timeline-zoom.component.html',
    styleUrls: ['./timeline-zoom.component.scss'],
})
export class TimelineZoomComponent {
    @Input() timeline: TimelineComponent;

    zoomIn(): void {
       this.timeline.zoomIn();
    }

    zoomOut(): void {
        this.timeline.zoomOut();
    }

    onSliderChange(index: number): void {
        this.timeline.changeZoom({zoom: DefaultZooms[index]});
    }

    scrollToToday(): void {
        this.timeline.zoomFullIn();
    }

    zoomAndFitToContent(): void {
        this.timeline.fitToContent();
    }
}



