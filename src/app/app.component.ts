import { Component } from '@angular/core';
import { ITimelineItem } from "angular-calendar-timeline";
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
      canDrag: true
    },
    {
      startDate: new Date('2022-07-09T00:00:00'),
      endDate: new Date('2022-07-19T00:00:00'),
      id: 2,
      name: "Second",
      canResizeLeft: true,
      canResizeRight: true,
      canDrag: true,
      items: [
        {
          startDate: new Date('2022-07-09T00:00:00'),
          endDate: new Date('2022-07-20T00:00:00'),
          id: 3,
          name: "2.1",
          canResizeLeft: true,
          canResizeRight: true,
          canDrag: true,
          items: [
            {
              startDate: new Date('2022-07-19T00:00:00'),
              endDate: new Date('2022-07-20T00:00:00'),
              id: 7,
              name: "2.1.1",
              canResizeLeft: true,
              canResizeRight: true,
              canDrag: true,
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
          canDrag: true,
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
      canDrag: true,
      items: [
        {
          startDate: new Date('2022-08-09T00:00:00'),
          endDate: new Date('2022-08-20T00:00:00'),
          id: 5,
          name: "3.1",
          canResizeLeft: true,
          canResizeRight: true,
          canDrag: true,
        }
      ]
    },
    {
      name: "combined",
      id: 6,
      stream: true,
      items: [
        {
          startDate: new Date('2022-08-09T00:00:00'),
          endDate: new Date('2022-08-20T00:00:00'),
          id: 7,
          name: "4",
          canResizeLeft: true,
          canResizeRight: true,
          canDrag: true,
        },
        {
          startDate: new Date('2022-08-09T00:00:00'),
          endDate: new Date('2022-08-20T00:00:00'),
          id: 8,
          name: "5",
          canResizeLeft: true,
          canResizeRight: true,
          canDrag: true,
        },
        {
          startDate: new Date('2022-07-09T00:00:00'),
          endDate: new Date('2022-07-20T00:00:00'),
          id: 9,
          name: "6",
          canResizeLeft: true,
          canResizeRight: true,
          canDrag: true,
        }
      ]
    }
  ];
}

