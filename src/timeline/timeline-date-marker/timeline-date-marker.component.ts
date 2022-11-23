import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-timeline-date-marker',
    templateUrl: './timeline-date-marker.component.html',
    styleUrls: ['./timeline-date-marker.component.scss'],
})
export class TimelineDateMarkerComponent {
    @Input() left: number = 0;
}
