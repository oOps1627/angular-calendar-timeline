import { Component, Input } from '@angular/core';
import { TimelineComponent } from '../timeline.component';
import { TimelineMaxZoomIndex, TimelineZooms } from '../models';

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
        this.timeline.changeZoom({zoom: TimelineZooms[index]});
    }

    scrollToToday(): void {
        this.timeline.changeZoom({zoom: TimelineZooms[TimelineMaxZoomIndex], date: new Date()});
    }

    zoomAndFitToContent(): void {
        this.timeline.fitToContent();
    }
}



