import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';
import { TimelineItemComponent } from './timeline-item/timeline-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableModule } from 'angular-resizable-element';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { TimelineDateMarkerComponent } from './timeline-date-marker/timeline-date-marker.component';
import { TimelineScaleHeaderComponent } from './timeline-scale-header/timeline-scale-header.component';
import { TimelineZoomComponent } from "./timeline-zoom/timeline-zoom.component";
import {
  ITimelineDivisionsCalculatorFactory,
  DIVISIONS_CALCULATOR_FACTORY, TimelineDivisionsCalculatorFactory
} from "./divisions-calculator/divisions-calculator-factory";
import { ITimelineZoom} from "./models";
import { DefaultZooms, ZOOMS } from "./zooms";

interface ITimelineModuleInitializationProviders {
  divisionsCalculatorFactory?: () => ITimelineDivisionsCalculatorFactory;
  zooms?: ITimelineZoom[];
}

@NgModule({
  declarations: [
    TimelineComponent,
    TimelineItemComponent,
    TimelineDateMarkerComponent,
    TimelineScaleHeaderComponent,
    TimelineZoomComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ResizableModule,
    DragAndDropModule,
  ],
  exports: [
    TimelineComponent,
    TimelineZoomComponent,
  ],
})
export class TimelineModule {
  static initialize(config?: ITimelineModuleInitializationProviders): ModuleWithProviders<TimelineModule> {
    return {
      ngModule: TimelineModule,
      providers: [
        {
          provide: DIVISIONS_CALCULATOR_FACTORY,
          useFactory: () => {
            return config?.divisionsCalculatorFactory() ?? new TimelineDivisionsCalculatorFactory();
          }
        },
        {
          provide: ZOOMS,
          useFactory: () => {
            return config?.zooms ?? DefaultZooms;
          }
        },
      ]
    }
  }
}
