<h1 align="center">Angular 13.0+ timeline calendar</h1>

<div align="center">

[![Sponsorship](https://img.shields.io/badge/funding-github-%23EA4AAA)](https://github.com/oOps1627)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

<h2 align="center">Demo</h2>

<div align="center">

https://mattlewis92.github.io/angular-calendar/

</div>

<h2 align="center">About</h2>

A timeline component for angular 13.0+ that shows tasks or events on a timeline in different modes: days, weeks, and
months.

This library DOESN'T use big dependencies like JQuery or Moment.js. It`s almost a pure Angular library.

<h2 align="center">Getting started</h2>

Install through npm:

```bash
npm install --save angular-timeline-calendar
```

Then import the timeline module into your module where you want to use timeline.

Don't forget to call forChild() method:

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

<h3 align="center">Custom dates format</h3>

Change localization very simple:

```typescript
import localeUk from "@angular/common/locales/uk";

registerLocaleData(localeUk);

@Component({
  template: `<timeline-calendar locale="uk"></timeline-calendar>`
})
```

In case if you need to change format of the dates in the header, you can provide custom formatters:

```typescript
import { NgModule } from '@angular/core';
import { TimelineModule, IScaleFormatter } from 'angular-timeline-calendar';

const myCustomFormatter: IScaleFormatter = {
  formatColumn(column: IScaleColumn, columnWidth: number, locale: string): string {
    return column.date.toString();
  }
}

@NgModule({
  imports: [
    TimelineModule.forChild({
      dayScaleFormatter: myCustomFormatter, // For days mode
      weekScaleFormatter: myCustomFormatter, // For weeks mode
      monthScaleFormatter: myCustomFormatter, // For months mode
    }),
  ],
})
export class MyModule {
}
```

<h3 align="center">Zooms</h3>

You can change current zoom by calling <b>changeZoom()</b> method in TimelineComponent. Also, you can set yor own zooms
array:

```typescript
import { AfterViewInit, ViewChild } from "@angular/core";
import { TimelineComponent, ITimelineZoom } from "angular-timeline-calendar";

@Component({
  template: `<timeline-calendar [zooms]="zooms"></timeline-calendar>`
})
export class MyTimelineComponent implements AfterViewInit {
  zooms: ITimelineZoom[] = [] // set custom array of zooms;
  @ViewChild(TimelineComponent) timeline: TimelineComponent;

  ngAfterViewInit(): void {
    // Change current zoom to any from zooms array.
    this.timeline.changeZoom(this.timeline.zooms[0]);

    // Change current zoom by one step next.
    this.timeline.changeZoom(this.timeline.zoomIn());
  }
}
```

This is not all component API. Later I will add some documentation. Currently, you can see comments inside
TimelineComponent.

<h3 align="center">Custom view modes</h3>

Library allows you to add custom view mode, for example years, hours, minutes etc. All you need it extend two
classes: <b>ScaleGeneratorsManager</b> and <b>DivisionsAdaptorsManager</b>.

<b>ScaleGeneratorsManager</b> returns scale generator depending on current zoom. Function of this generator is build the
header with columns and dates inside each column. 
For each view mode existed own generator (they implement one interface), so it is the reason why
we need some "manager".

<b>DivisionsAdaptorsManager</b> contains adaptors for different view modes. Those Adaptors use common interface, and
they need for calculating operations with dates.

There is example how it should looks like, when I want to provide some additional view mode:

```typescript
import { NgModule } from '@angular/core';
import {
  TimelineModule,
  TimelineDivisionType,
  IScaleFormatter,
  IScaleGenerator,
  ScaleGeneratorsManager,
  IScaleGeneratorsManager,
  DivisionsAdaptorsManager,
  IDivisionsAdaptorsManager
} from 'angular-timeline-calendar';

enum CustomZoomDivisionsType {
  Day = TimelineDivisionType.Day,
  Week = TimelineDivisionType.Week,
  Month = TimelineDivisionType.Month,
  Custom = 'Custom'
}

class CustomScaleGeneratorsManager extends ScaleGeneratorsManager
  implements IScaleGeneratorsManager {
  getGenerator(zoom: ITimelineZoom<CustomZoomDivisionsType>): IScaleGenerator {
    if (zoom.division === CustomZoomDivisionsType.Custom) {
      return {...};  // your custom logic here
    }

    return super.getGenerator(zoom);
  };
}

class CustomDivisionsAdaptorsManager extends DivisionsAdaptorsManager
  implements IDivisionsAdaptorsManager<CustomZoomDivisionsType> {
  getAdaptor(division: TimelineDivisionType): IDivisionAdaptor {
    if (division === CustomZoomDivisionsType.Custom) {
      return {...} // custom adaptor;
    }

    return super.getAdaptor(division);
  }
}

@NgModule({
  imports: [
    TimelineModule.forChild({
      scaleGeneratorsManager: CustomScaleGeneratorsManager,
      divisionsAdaptorsManager: CustomDivisionsAdaptorsManager,
    }),
  ],
})
export class MyModule {
}
```

<div align="center">
https://github.com/oOps1627/angular-calendar-timeline
</div>
