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
  ITimelineDivisionsAdaptorsFactory,
  DIVISIONS_ADAPTORS_FACTORY, TimelineDivisionsAdaptorsFactory
} from "./divisions-calculator/divisions-adaptors-factory";
import { ITimelineZoom } from "./models";
import { DefaultZooms, ZOOMS } from "./zooms";
import {
  IScaleGeneratorsFactory,
  SCALE_GENERATORS_FACTORY,
  ScaleGeneratorsFactory
} from "./scale-generator/scale-generators-factory";
import { ZoomService } from "./zoom.service";

interface ITimelineModuleInitializationProviders {
  divisionsCalculatorFactory?: () => ITimelineDivisionsAdaptorsFactory;
  scaleGeneratorsFactory?: () => IScaleGeneratorsFactory;
  zooms?: ITimelineZoom[];
}

@NgModule({
  declarations: [
    TimelineComponent,
    TimelineItemComponent,
    TimelineDateMarkerComponent,
    TimelineScaleHeaderComponent,
    TimelineZoomComponent,
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
  providers: [
    ZoomService,
  ]
})
export class TimelineModule {
  static forChild(config?: ITimelineModuleInitializationProviders): ModuleWithProviders<TimelineModule> {
    return {
      ngModule: TimelineModule,
      providers: [
        {
          provide: DIVISIONS_ADAPTORS_FACTORY,
          useFactory: () => {
            return (config?.divisionsCalculatorFactory() && config.divisionsCalculatorFactory()) ?? new TimelineDivisionsAdaptorsFactory();
          }
        },
        {
          provide: SCALE_GENERATORS_FACTORY,
          useFactory: () => {
            return (config?.scaleGeneratorsFactory && config.scaleGeneratorsFactory()) ?? new ScaleGeneratorsFactory();
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
