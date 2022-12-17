<div align="center">

![#1589F0](https://placehold.co/150x20/1589F0/1589F0.png) <br>
![#c5f015](https://placehold.co/150x20/c5f015/c5f015.png)

</div>

<h1 align="center">Angular 13.0+ timeline calendar</h1>

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
npm install --save angular-timeline-calendar
```

Then import the timeline module into your module where you want to use timeline.

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

<h3 align="center">Custom dates format</h3>

Change localization is very simple:

```typescript
import localeUk from "@angular/common/locales/uk";

registerLocaleData(localeUk);

@Component({
  template: `<timeline-calendar locale="uk"></timeline-calendar>`
})
```

In case you need to change the format of the dates in the header, you can provide custom formatters:

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

You can change current zoom by calling <b>changeZoom()</b> method in TimelineComponent. Also, you can set your own zooms
array:

```typescript
import { AfterViewInit, ViewChild } from "@angular/core";
import { TimelineComponent, ITimelineZoom } from "angular-timeline-calendar";

@Component({
  template: `<timeline-calendar #timeline [zooms]="zooms"></timeline-calendar>`
})
export class MyTimelineComponent implements AfterViewInit {
  zooms: ITimelineZoom[] = [] // set custom array of zooms;
  @ViewChild('timeline') timeline: TimelineComponent;

  ngAfterViewInit(): void {
    // Change current zoom to any from zooms array.
    this.timeline.changeZoom(this.timeline.zooms[0]);

    // Change current zoom by one step next.
    this.timeline.zoomIn();
  }
}
```

This is not all API of component. Maybe later I will add some documentation. Currently, you can see comments inside
TimelineComponent.

<h3 align="center">Custom view modes</h3>

The library allows you to add custom view modes, for example, years, hours, minutes, etc. All you have to do is extends two
classes: <b>ScaleGeneratorsManager</b> and <b>DivisionsAdaptorsManager</b>.

<b>ScaleGeneratorsManager</b> returns a scale generator depending on the current zoom. The function of this generator is to build the
header with columns and dates inside each column.
Each view mode has its own generator, so it is the reason why we need some "manager".

<b>DivisionsAdaptorsManager</b> contains adaptors for different view modes. Those Adaptors use a common interface, and
they are necessary for calculating operations with dates.

Here is an example of how it should look, when you want to add some additional view modes:

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
  implements IScaleGeneratorsManager<CustomZoomDivisionsType> {
  getGenerator(division: CustomZoomDivisionsType): IScaleGenerator {
    if (division === CustomZoomDivisionsType.Custom) {
      return {...};  // your custom logic here
    }

    return super.getGenerator(zoom);
  };
}

class CustomDivisionsAdaptorsManager extends DivisionsAdaptorsManager
  implements IDivisionsAdaptorsManager<CustomZoomDivisionsType> {
  getAdaptor(division: CustomZoomDivisionsType): IDivisionAdaptor {
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

Have an issue? Leave it here: https://github.com/oOps1627/angular-calendar-timeline/issues

