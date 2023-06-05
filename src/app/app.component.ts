import { Component } from '@angular/core';
import { IItemRowChangedEvent, IItemTimeChangedEvent, ITimelineItem } from "angular-calendar-timeline";
import { registerLocaleData } from "@angular/common";
import localeUk from "@angular/common/locales/uk";

registerLocaleData(localeUk);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  label = 'Label';

  locale = 'en';

  items: ITimelineItem[] = [
    {
      startDate: new Date('2022-07-08T00:00:00'),
      endDate: new Date('2022-07-09T00:00:00'),
      id: 1,
      name: "First",
      canResizeLeft: true,
      canResizeRight: true,
      canDragX: true,
      canDragY: true,
    },
    {
      startDate: new Date('2022-07-09T00:00:00'),
      endDate: new Date('2022-07-19T00:00:00'),
      id: 2,
      name: "Second",
      canResizeLeft: true,
      canResizeRight: true,
      canDragX: true,
      canDragY: true,
      childrenItems: [
        {
          startDate: new Date('2022-07-09T00:00:00'),
          endDate: new Date('2022-07-20T00:00:00'),
          id: 3,
          name: "2.1",
          canResizeLeft: true,
          canResizeRight: true,
          canDragX: true,
          canDragY: true,
          childrenItems: [
            {
              startDate: new Date('2022-07-19T00:00:00'),
              endDate: new Date('2022-07-20T00:00:00'),
              id: 7,
              name: "2.1.1",
              canResizeLeft: true,
              canResizeRight: true,
              canDragX: true,
              canDragY: true,
            }
          ]
        },
        {
          startDate: new Date('2022-07-09T00:00:00'),
          endDate: new Date('2022-07-20T00:00:00'),
          id: 6,
          name: "2.2",
          canResizeLeft: true,
          canResizeRight: true,
          canDragX: true,
          canDragY: true,
        }
      ]
    },
    {
      startDate: new Date('2022-08-09T00:00:00'),
      endDate: new Date('2022-08-19T00:00:00'),
      id: 4,
      name: "Third",
      canResizeLeft: true,
      canResizeRight: true,
      canDragX: true,
      canDragY: true,
      childrenItems: [
        {
          startDate: new Date('2022-08-09T00:00:00'),
          endDate: new Date('2022-08-20T00:00:00'),
          id: 5,
          name: "3.1",
          canResizeLeft: true,
          canResizeRight: true,
          canDragX: true,
          canDragY: true,
        }
      ]
    },
    {
      name: "Stream",
      id: 6,
      streamItems: [
        {
          startDate: new Date('2022-08-09T00:00:00'),
          endDate: new Date('2022-08-20T00:00:00'),
          id: 7,
          name: "4",
          canResizeLeft: true,
          canResizeRight: true,
          canDragX: true,
          canDragY: true,
        },
        {
          startDate: new Date('2022-08-09T00:00:00'),
          endDate: new Date('2022-08-20T00:00:00'),
          id: 8,
          name: "5",
          canResizeLeft: true,
          canResizeRight: true,
          canDragX: true,
          canDragY: true,
        },
        {
          startDate: new Date('2022-07-09T00:00:00'),
          endDate: new Date('2022-07-20T00:00:00'),
          id: 9,
          name: "6",
          canResizeLeft: true,
          canResizeRight: true,
          canDragX: true,
          canDragY: true,
        }
      ],
      childrenItems: [
        {
          id: 11,
          name: "Stream 11",
          streamItems: [
            {
              startDate: new Date('2022-07-09T00:00:00'),
              endDate: new Date('2022-07-20T00:00:00'),
              id: 14,
              name: "Stream 11 (1)",
              canResizeLeft: true,
              canResizeRight: true,
              canDragX: true,
              canDragY: true,
            },
            {
              startDate: new Date('2022-07-09T00:00:00'),
              endDate: new Date('2022-07-20T00:00:00'),
              id: 15,
              name: "Stream 11 (2)",
              canResizeLeft: true,
              canResizeRight: true,
              canDragX: true,
              canDragY: true,
            },
          ]
        },
        {
          startDate: new Date('2022-08-09T00:00:00'),
          endDate: new Date('2022-08-20T00:00:00'),
          id: 12,
          name: "21e25",
          canResizeLeft: true,
          canResizeRight: true,
          canDragX: true,
          canDragY: true,
          childrenItems: [
            {
              startDate: new Date('2022-09-09T00:00:00'),
              endDate: new Date('2022-09-20T00:00:00'),
              id: 13,
              name: "asda",
              canResizeLeft: true,
              canResizeRight: true,
              canDragX: true,
              canDragY: true,
            },
          ]
        },
      ]
    }
  ];

  onItemTimeChanged(event: IItemTimeChangedEvent): void {
    const item = event.item;
    item.startDate = event.newStartDate ?? item.startDate;
    item.endDate = event.newEndDate ?? item.endDate;
    this.items = [...this.items];
  }

  onItemRowChanged(event: IItemRowChangedEvent): void {
    console.log(event);
  }
}

