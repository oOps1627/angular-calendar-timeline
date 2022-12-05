import { Component, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-timeline-date-marker',
    templateUrl: './timeline-date-marker.component.html',
    styleUrls: ['./timeline-date-marker.component.scss'],
})
export class TimelineDateMarkerComponent {
    @Input() leftPosition: number = 0;

    @Input() headerHeight: number;

    @Input() customTemplate: TemplateRef<{ leftPosition: number }> | undefined;
}
