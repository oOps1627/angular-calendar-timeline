import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-timeline-date-marker',
    templateUrl: './timeline-date-marker.component.html',
    styleUrls: ['./timeline-date-marker.component.scss'],
})
export class TimelineDateMarkerComponent implements OnInit {
    @Input() isEmpty: boolean = false;
    @Input() left: number = 0;

    constructor() {
    }

    ngOnInit() {
    }

}
