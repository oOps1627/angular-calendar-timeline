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
  locale = 'uk';

  items: ITimelineItem[] = [
    {
      startDate: new Date('2021-07-08T00:00:00'),
      endDate: new Date('2021-07-09T00:00:00'),
      id: 1,
      name: "FIRST",
      canResizeLeft: true,
      canResizeRight: true,
      canDrag: true
    },
    {
      startDate: new Date('2021-07-09T00:00:00'),
      endDate: new Date('2021-07-19T00:00:00'),
      id: 2,
      name: "Second",
      canResizeLeft: true,
      canResizeRight: true,
      canDrag: true,
      items: [
        {
          startDate: new Date('2021-07-09T00:00:00'),
          endDate: new Date('2021-07-20T00:00:00'),
          id: 3,
          name: "Inner",
          canResizeLeft: true,
          canResizeRight: true,
          canDrag: true,
          items: [
            {
              startDate: new Date('2021-07-19T00:00:00'),
              endDate: new Date('2021-07-20T00:00:00'),
              id: 7,
              name: "Inner inner",
              canResizeLeft: true,
              canResizeRight: true,
              canDrag: true,
            }
          ]
        },
        {
          startDate: new Date('2021-07-09T00:00:00'),
          endDate: new Date('2021-07-20T00:00:00'),
          id: 6,
          name: "Inner 2",
          canResizeLeft: true,
          canResizeRight: true,
          canDrag: true,
        }
      ]
    },
    {
      startDate: new Date('2021-08-09T00:00:00'),
      endDate: new Date('2021-08-19T00:00:00'),
      id: 4,
      name: "Third",
      canResizeLeft: true,
      canResizeRight: true,
      canDrag: true,
      items: [
        {
          startDate: new Date('2021-08-09T00:00:00'),
          endDate: new Date('2021-08-20T00:00:00'),
          id: 5,
          name: "Inner 3",
          canResizeLeft: true,
          canResizeRight: true,
          canDrag: true,
        }
      ]
    }
  ];
}

