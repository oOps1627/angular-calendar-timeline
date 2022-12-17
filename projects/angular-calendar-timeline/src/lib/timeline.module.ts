import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';
import { TimelineItemComponent } from './timeline-item/timeline-item.component';
import { ResizableModule } from 'angular-resizable-element';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { TimelineDateMarkerComponent } from './timeline-date-marker/timeline-date-marker.component';
import { TimelineScaleHeaderComponent } from './timeline-scale-header/timeline-scale-header.component';
import { DAY_SCALE_FORMATTER, DayScaleFormatter, } from "./formatters/day-scale-formatter";
import { WEEK_SCALE_FORMATTER, WeekScaleFormatter } from "./formatters/week-scale-formatter";
import { MONTH_SCALE_FORMATTER, MonthScaleFormatter } from "./formatters/month-scale-formatter";
import { DayScaleGenerator } from "./scale-generator/day-scale-generator";
import { WeekScaleGenerator } from "./scale-generator/week-scale-generator";
import { MonthScaleGenerator } from "./scale-generator/month-scale-generator";
import { TimelinePanelComponent } from "./panel/timeline-panel.component";
import { IScaleFormatter, ITimelineZoom } from "./models";
import { StrategyManager } from "./strategy-manager";

interface ITimelineModuleInitializationConfig {
  /**
   * Provide it when you want to extend current timeline logic and add some new view types.
   * Should be provided StrategyManager class with IStrategyManager implementation.
   */
  strategyManager?: Provider;

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
   * List of zooms.
   */
  zooms?: ITimelineZoom[];

  /**
   * Text formatter for header in days mode.
   */
  dayScaleFormatter?: IScaleFormatter;

  /**
   * Text formatter for header in weeks mode.
   */
  weekScaleFormatter?: IScaleFormatter;

  /**
   * Text formatter for header in months mode.
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
    ResizableModule,
    DragAndDropModule,
  ],
  exports: [
    TimelineComponent,
  ],
})
export class TimelineModule {
  static forChild(config?: ITimelineModuleInitializationConfig): ModuleWithProviders<TimelineModule> {
    return {
      ngModule: TimelineModule,
      providers: [
        config?.strategyManager ?? StrategyManager,
        config?.dayScaleGenerator ?? DayScaleGenerator,
        config?.weekScaleGenerator ?? WeekScaleGenerator,
        config?.monthScaleGenerator ?? MonthScaleGenerator,
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
      ]
    }
  }
}
