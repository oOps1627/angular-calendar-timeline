<div align="center">

![#1589F0](https://placehold.co/150x20/1589F0/1589F0.png) <br>
![#c5f015](https://placehold.co/150x20/c5f015/c5f015.png)

</div>

<h1 align="center">Angular 13+ timeline calendar</h1>

<div align="center">

[![Sponsorship](https://img.shields.io/badge/funding-github-%23EA4AAA)](https://github.com/oOps1627)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



</div>

<h2 align="center">Demo</h2>

<div align="center">

https://codesandbox.io/s/tender-cerf-zk0ewt

</div>

<h2 align="center">About</h2>

A timeline for angular 13+ that shows tasks or events on a timeline in different modes: days, weeks, and
months.

This library is pretty small and DOESN'T use big dependencies like JQuery or Moment.js.
Library also supports SSR.

<h2 align="center">Getting started</h2>

Install through npm:

```bash
npm install --save angular-calendar-timeline
```

Then import the timeline module into the module where you want to use the timeline.

Don't forget to call <b>forChild()</b> method:

```typescript
import { NgModule } from '@angular/core';
import { TimelineModule } from 'angular-timeline-calendar';

@NgModule({
  imports: [
    TimelineModule.forChild(),
  ],
})
export class MyModule {
}
```

That's it, you can then use it in your component as:

```typescript
import { ITimelineItem } from "angular-timeline-calendar";

@Component({
  template: `<timeline-calendar [items]="items"> </timeline-calendar>`
})
export class MyTimelineComponent implements AfterViewInit {
  items: ITimelineItem[] = [];
}
```

<h2 align="center">Customization</h2>

<h3 align="center">1. Localization</h3>

Change localization is very simple, just pass locale code to the 'locale' component input.
Make sure that the current locale is registered by Angular:

```typescript
import localeUk from "@angular/common/locales/uk";

registerLocaleData(localeUk);

@Component({
  template: `<timeline-calendar locale="uk"></timeline-calendar>`
})
```

<h3 align="center">2. Header</h3>

You can customize the scale view by providing a config for each view mode.  
In case you need to change the format of the dates in the header or change start or end dates, you can provide a config for each view mode:

```typescript
import { NgModule } from '@angular/core';
import { TimelineModule,
  IScaleFormatter, 
  IScaleGeneratorConfig,
  IItemsIterator } from 'angular-timeline-calendar';

const myCustomFormatter: IScaleFormatter = {
  formatColumn(column: IScaleColumn, columnWidth: number, locale: string): string {
    return column.date.toString();
  }
}

@NgModule({
  imports: [
    TimelineModule.forChild({
      // Customization dates range and their format in the header for day view mode.
      dayScaleConfig: {
        formatter: myCustomFormatter,
        getStartDate: (itemsIterator: IItemsIterator) => itemsIterator.getFirstItem(true).startDate,
        getEndDate: (itemsIterator: IItemsIterator) => new Date(),
      } as Partial<IScaleGeneratorConfig>,
      // Customization dates format in the header for week view mode.
      weekScaleConfig: {
          formatter: myCustomFormatter
      } as Partial<IScaleGeneratorConfig>
    }),
  ],
})
export class MyModule {
}
```

<h3 align="center">3. Zooms</h3>

You can simply set your own zooms if you want to add more.
For changing the current zoom use TimelineComponent API. Here is an example:

```typescript
import { AfterViewInit, ViewChild } from "@angular/core";
import { TimelineComponent,
  ITimelineZoom,
  DefaultZooms,
  TimelineViewMode } from "angular-timeline-calendar";

@Component({
  template: `<timeline-calendar #timeline [zooms]="zooms"></timeline-calendar>`
})
export class MyTimelineComponent implements AfterViewInit {
  @ViewChild('timeline') timeline: TimelineComponent;
  
  zooms: ITimelineZoom[] = [
    {columnWidth: 50, viewMode: TimelineViewMode.Month},
    {columnWidth: 55, viewMode: TimelineViewMode.Month},
    {columnWidth: 50, viewMode: TimelineViewMode.Days},
    DefaultZooms[0] // You can import and use default array;
  ];
  
  ngAfterViewInit(): void {
    // Change current zoom to any of passed to 'zooms' @Input.
    this.timeline.changeZoom(this.timeline.zooms[1]);

    // Change current zoom by one step next.
    this.timeline.zoomIn();

    // Change current zoom by one step back.
    this.timeline.zoomOut();
  }
}
```

This is not all API of component. Maybe later I will add some documentation. Currently, you can see comments inside
TimelineComponent.

<h3 align="center">4. Templates</h3>

You easily can customize timeline items view, date marker, and left panel by passing custom TemplateRef:

```html
<timeline-calendar 
  [itemContentTemplate]="customItemTemplate"
  [dateMarkerTemplate]="customDateMarkerTemplate"
></timeline-calendar>

<ng-template #customItemTemplate let-item let-locale="locale">
  {{item.name}} {{item.startDate}} {{item.endDate}} {{locale}}
</ng-template>

<ng-template #customDateMarkerTemplate let-leftPosition="leftPosition">
  dateMarkerTemplate
</ng-template>
```

<h3 align="center">5. View modes</h3>

The library allows you to add custom view modes, for example, years, hours, minutes, etc. All you have to do is extends <b>StrategyManager</b>
class.
Based on the current view type it returns different strategies with a common interface which needs for calculating operations between dates and generating scale.


Here is an example of how it should look, when you want to add some additional view modes:

```typescript
import { NgModule } from '@angular/core';
import {
  TimelineModule,
  TimelineViewMode,
  IScaleFormatter,
  IStrategyManager,
  StrategyManager,
} from 'angular-timeline-calendar';

enum CustomViewMode {
  CustomView = 1,
  Day = TimelineViewMode.Day,
  Week = TimelineViewMode.Week,
  Month = TimelineViewMode.Month,
}

class CustomStrategyManager extends StrategyManager implements IStrategyManager<CustomViewMode> {
  getScaleGenerator(viewMode): IScaleGenerator {
    if (viewMode === CustomViewMode.Custom) {
      return {...};  // your custom logic here
    }

    return super.getScaleGenerator(viewMode);
  };

  getViewModeAdaptor(viewMode): IViewModeAdaptor {
    if (viewMode === CustomViewMode.Custom) {
      return {...} // custom adaptor;
    }

    return super.getViewModeAdaptor(viewMode);
  }
}

@NgModule({
  imports: [
    TimelineModule.forChild({
      strategyManager: StrategyManager,
    }),
  ],
  providers: [{
    provide: StrategyManager,
    useClass: CustomStrategyManager,
  }],
})
export class MyModule {
}
```


<h2 align="center">Angular versions</h2>

<li>For Angular = 13 use <b>0.4</b></li>
<li>For Angular >= 14 use <b>0.5</b></li>
<li>For Angular >= 16 use <b>0.6</b></li>

<br>

Have an issue? Leave it here: https://github.com/oOps1627/angular-calendar-timeline/issues

You can support me by donation:
* https://www.paypal.com/donate/?hosted_button_id=38ZN57VTQ9TQC
* https://buymeacoffee.com/andriy1627

