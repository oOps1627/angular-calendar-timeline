import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { ITimelineItem } from '../models';

@Component({
    selector: 'app-timeline-item',
    templateUrl: './timeline-item.component.html',
    styleUrls: ['./timeline-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineItemComponent {
    @Input() item: ITimelineItem | undefined;
    @Input() contentTemplate: TemplateRef<any> | undefined;
}
