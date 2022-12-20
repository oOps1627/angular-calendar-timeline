import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';
import { TimelineItemComponent } from './components/item/timeline-item.component';
import { ResizableModule } from 'angular-resizable-element';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { TimelineDateMarkerComponent } from './components/date-marker/timeline-date-marker.component';
import { TimelineScaleHeaderComponent } from './components/scale-header/timeline-scale-header.component';
import { DAY_SCALE_GENERATOR_CONFIG, DayScaleGenerator } from "./scale-generator/day-scale-generator";
import { WEEK_SCALE_GENERATOR_CONFIG, WeekScaleGenerator } from "./scale-generator/week-scale-generator";
import { MONTH_SCALE_GENERATOR_CONFIG, MonthScaleGenerator } from "./scale-generator/month-scale-generator";
import { TimelinePanelComponent } from "./components/panel/timeline-panel.component";
import { IScaleGeneratorConfig, ITimelineZoom } from "./models";
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
   * Settings for the scale generation in day mode.
   */
  dayScaleConfig?: Partial<IScaleGeneratorConfig>;

  /**
   * Settings for the scale generation in week mode.
   */
  weekScaleConfig?: Partial<IScaleGeneratorConfig>;

  /**
   * Settings for the scale generation in month mode.
   */
  monthScaleConfig?: Partial<IScaleGeneratorConfig>;
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
          provide: DAY_SCALE_GENERATOR_CONFIG,
          useValue: config?.dayScaleConfig
        },
        {
          provide: WEEK_SCALE_GENERATOR_CONFIG,
          useValue: config?.weekScaleConfig
        },
        {
          provide: MONTH_SCALE_GENERATOR_CONFIG,
          useValue: config?.monthScaleConfig
        },
      ]
    }
  }
}
