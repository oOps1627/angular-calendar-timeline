import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';
import { TimelineItemComponent } from './timeline-item/timeline-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableModule } from 'angular-resizable-element';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { TimelineDateMarkerComponent } from './timeline-date-marker/timeline-date-marker.component';
import { TimelineScaleHeaderComponent } from './timeline-scale-header/timeline-scale-header.component';
import { TimelineDivisionsAdaptorsManager } from "./divisions-calculator/divisions-adaptors-factory";
import { ITimelineZoom } from "./models";
import { DefaultZooms, ZOOMS } from "./zooms";
import { ScaleGeneratorsManager } from "./scale-generator/scale-generators-manager";
import { ZoomService } from "./zoom.service";
import { DAY_SCALE_FORMATTER, DayScaleFormatter, } from "./formatters/day-scale-formatter";
import { IScaleFormatter } from "./formatters/scale-formatter.interface";
import { WEEK_SCALE_FORMATTER, WeekScaleFormatter } from "./formatters/week-scale-formatter";
import { MONTH_SCALE_FORMATTER, MonthScaleFormatter } from "./formatters/month-scale-formatter";
import { DayScaleGenerator } from "./scale-generator/day-scale-generator";
import { WeekScaleGenerator } from "./scale-generator/week-scale-generator";
import { MonthScaleGenerator } from "./scale-generator/month-scale-generator";
import { TimelinePanelComponent } from "./panel/timeline-panel.component";

interface ITimelineModuleInitializationProviders {
  /**
   * Provide it when you want to extend current timeline logic and add some new divisions.
   * Should be provided ScaleGeneratorsManager class with IScaleGeneratorsManager implementation.
   */
  scaleGeneratorsManager?: Provider;

  /**
   * If you added some new division types, you should also add new custom calculation logic to this divisions.
   * You can do it by providing new TimelineDivisionsAdaptorsManager class with ITimelineDivisionsAdaptorsManager implementation.
   */
  divisionsAdaptorsManager?: Provider;

  /**
   * Should be provided DayScaleGenerator class with IScaleGenerator implementation.
   */
  dayScaleGenerator?: Provider;

  /**
   * Should be provided WeekScaleGenerator class with IScaleGenerator implementation.
   */
  weekScaleGenerator?: Provider;

  /**
   * Should be provided MonthScaleGenerator class with IScaleGenerator implementation.
   */
  monthScaleGenerator?: Provider;

  /**
   * List of zooms. Can be used custom array
   */
  zooms?: ITimelineZoom[];

  /**
   * Text formatter for days mode in header
   */
  dayScaleFormatter?: IScaleFormatter;

  /**
   * Text formatter for weeks mode in header
   */
  weekScaleFormatter?: IScaleFormatter;

  /**
   * Text formatter for months mode in header
   */
  monthScaleFormatter?: IScaleFormatter;
}

@NgModule({
  declarations: [
    TimelineComponent,
    TimelineItemComponent,
    TimelineDateMarkerComponent,
    TimelineScaleHeaderComponent,
    TimelinePanelComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ResizableModule,
    DragAndDropModule,
  ],
  exports: [
    TimelineComponent,
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
        config?.scaleGeneratorsManager ?? ScaleGeneratorsManager,
        config?.dayScaleGenerator ?? DayScaleGenerator,
        config?.weekScaleGenerator ?? WeekScaleGenerator,
        config?.monthScaleGenerator ?? MonthScaleGenerator,
        config?.divisionsAdaptorsManager ?? TimelineDivisionsAdaptorsManager,
        {
          provide: DAY_SCALE_FORMATTER,
          useValue: config?.dayScaleFormatter ?? new DayScaleFormatter()
        },
        {
          provide: WEEK_SCALE_FORMATTER,
          useValue: config?.weekScaleFormatter ?? new WeekScaleFormatter()
        },
        {
          provide: MONTH_SCALE_FORMATTER,
          useValue: config?.monthScaleFormatter ?? new MonthScaleFormatter()
        },
        {
          provide: ZOOMS,
          useValue: config?.zooms ?? DefaultZooms,
        },
      ]
    }
  }
}
