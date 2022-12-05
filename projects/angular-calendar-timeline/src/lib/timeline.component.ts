import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy, Output,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ScaleGeneratorsManager } from './scale-generator/scale-generators-manager';
import { ResizeEvent } from 'angular-resizable-element';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { IIdObject, ITimelineItem, ITimelineZoom, } from './models';
import { interval } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { startWith } from 'rxjs/operators';
import { TimelineDivisionsAdaptorsManager } from './divisions-calculator/divisions-adaptors-factory';
import { IScale, IScaleGenerator } from './scale-generator/models';
import { isPlatformBrowser } from "@angular/common";
import { ZoomService } from "./zoom.service";
import { TimeInMilliseconds } from "./date-helpers";
import { IDivisionAdaptor } from "./divisions-calculator/base-divisions-adaptor";
import { ItemsBuilder } from "./items-builder/items-builder";

@Component({
  selector: 'timeline-calendar',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements AfterViewInit, OnDestroy {
  currentDate: Date = new Date();

  dateMarkerLeftPosition: number = 0;

  scale: IScale | undefined;

  itemsBuilder = new ItemsBuilder();

  private _ignoreNextScrollEvent = false;

  @ViewChild('timeline') timelineElement: ElementRef<HTMLElement> | undefined;

  @Output() itemDatesChanged = new EventEmitter<ITimelineItem>();

  @Input() locale: string = 'en';

  @Input() rowHeight: number = 45;

  @Input() itemHeight: number = 39;

  @Input() headerHeight: number = 60;

  @Input() panelLabel: string = '';

  @Input() panelWidth: number = 160;

  @Input() panelItemTemplate: TemplateRef<{ item: ITimelineItem, index: number, depth: number, locale: string }>

  @Input() itemContentTemplate: TemplateRef<{ $implicit: ITimelineItem }> | undefined;

  @Input() dateMarkerTemplate: TemplateRef<{ leftPosition: number }> | undefined;

  @Input()
  set items(items) {
    this.itemsBuilder.setItems(items);
    this.redraw();
  }

  get visibleScaleWidth(): number {
    return this._elementRef.nativeElement.clientWidth - this.panelWidth;
  }

  get scaleGenerator(): IScaleGenerator {
    return this._scaleGeneratorsFactory.getGenerator(this.zoom);
  }

  get divisionAdaptor(): IDivisionAdaptor {
    return this._divisionsAdaptorsFactory.getAdaptor(this.zoom.division);
  }

  get zoom(): ITimelineZoom {
    return this._zoomService.zoom;
  }

  constructor(private _cdr: ChangeDetectorRef,
              private _zoomService: ZoomService,
              private _divisionsAdaptorsFactory: TimelineDivisionsAdaptorsManager,
              private _scaleGeneratorsFactory: ScaleGeneratorsManager,
              @Inject(ElementRef) private _elementRef: ElementRef,
              @Inject(PLATFORM_ID) private _platformId: object) {
    this._zoomService._registerComponent(this);
  }

  ngAfterViewInit() {
    this._zoomService.zoom$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.redraw());

    if (isPlatformBrowser(this._platformId)) {
      interval(TimeInMilliseconds.Minute)
        .pipe(startWith(''), untilDestroyed(this))
        .subscribe(() => this._recalculateDateMarkerPosition());
    }
  }

  redraw(): void {
    this._generateScale();
    this._updateItemsPosition();
    this._recalculateDateMarkerPosition();
    this._ignoreNextScrollEvent = true;
    this.attachCameraToDate(this.currentDate);
    this._cdr.detectChanges();
  }

  attachCameraToDate(date: Date): void {
    const duration = this.divisionAdaptor.getDurationInDivisions(this.scale.startDate, date);
    const scrollLeft = (duration * this.zoom.columnWidth) - (this.visibleScaleWidth / 2);
    this._ignoreNextScrollEvent = true;

    if (this._elementRef.nativeElement) {
      this._elementRef.nativeElement.scrollLeft = scrollLeft < 0 ? 0 : scrollLeft;
    }
  }

  fitToContent(paddings: number): void {
    const firstItem = this.itemsBuilder.getFirstItem(true);
    const lastItem = this.itemsBuilder.getLastItem(true);

    if (!firstItem || !lastItem)
      return;

    const startDate = new Date(firstItem.startDate);
    const endDate = new Date(lastItem.endDate);
    const zoom = this._zoomService._calculateOptimalZoom(startDate, endDate, this.visibleScaleWidth, paddings);
    const divisionAdaptor = this._divisionsAdaptorsFactory.getAdaptor(zoom.division);

    this.currentDate = new Date(divisionAdaptor.getTimeInDivisionsCenter(startDate, endDate));

    if (this._zoomService.isZoomActive(zoom)) {
      this.attachCameraToDate(this.currentDate);
    } else {
      this._zoomService.changeZoom(zoom);
    }
  }

  /**
   * @hidden
   */
  @HostListener('scroll', ['$event'])
  _onScroll(event: Event): void {
    if (!this._ignoreNextScrollEvent) {
      this.currentDate = this._getCurrentDate();
    }
    this._ignoreNextScrollEvent = false;
  }

  /**
   * @hidden
   */
  _getCurrentDate(): Date {
    const currentScrollLeft = this._elementRef.nativeElement.scrollLeft ?? 0;
    const scrollLeftToCenterScreen = currentScrollLeft + (this.visibleScaleWidth / 2);
    const columns = Math.round(scrollLeftToCenterScreen / this.zoom.columnWidth);

    return this.divisionAdaptor.addDivisionToDate(this.scale.startDate, columns);
  }

  /**
   * @hidden
   */
  _onItemDropped(event: CdkDragEnd, item: ITimelineItem): void {
    const divisionCalculator = this.divisionAdaptor;
    const transferColumns = Math.round(event.distance.x / this.zoom.columnWidth);
    const newStartDate = divisionCalculator.addDivisionToDate(new Date(item.startDate), transferColumns);
    const newEndDate = divisionCalculator.addDivisionToDate(new Date(item.endDate), transferColumns);
    item.startDate = newStartDate.toISOString();
    item.endDate = newEndDate.toISOString();
    event.source._dragRef.reset();
    this._updateItemPosition(item);
    this.itemDatesChanged.emit(item);
  }

  /**
   * @hidden
   */
  _trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }

  /**
   * @hidden
   */
  _onItemResizeEnd(event: ResizeEvent, item: ITimelineItem): void {
    const divisionCalculator = this.divisionAdaptor;
    const {left, right} = event.edges;

    const calculateNewDate = (movedPx: number, oldDate: Date): Date => {
      const countOfColumnsMoved = Math.round(movedPx as number / this.zoom.columnWidth);
      return divisionCalculator.addDivisionToDate(oldDate, countOfColumnsMoved);
    }

    if (left) {
      const newStartDate = calculateNewDate(<number>left, new Date(item.startDate));

      if (newStartDate.getTime() > new Date(item.endDate).getTime()) {
        return;
      }
      item.startDate = newStartDate.toISOString();
    } else {
      const newEndDate = calculateNewDate(<number>right, new Date(item.endDate));
      if (newEndDate.getTime() < new Date(item.startDate).getTime()) {
        return;
      }
      item.endDate = newEndDate.toISOString();
    }

    this._updateItemPosition(item);
    this.itemDatesChanged.emit(item);
  }

  private _generateScale(): void {
    const scaleStartDate = this.scaleGenerator.getStartDateByFirstItem(this.itemsBuilder.getFirstItem(false));
    const scaleEndDate = this.scaleGenerator.getEndDateByLastItem(this.itemsBuilder.getLastItem(false));
    this.scale = this.scaleGenerator.generateScale(scaleStartDate, scaleEndDate);
  }

  private _updateItemsPosition(): void {
    this.itemsBuilder.forEach((item) => this._updateItemPosition(item));
  }

  private _updateItemPosition(item: ITimelineItem): void {
    item._width = this._calculateItemWidth(item);
    item._left = this._calculateItemLeftPosition(item);
    item._redraw && item._redraw();
  }

  private _calculateItemLeftPosition(item: ITimelineItem): number {
    if (!item.startDate || !item.endDate)
      return 0;

    const columnsOffsetFromStart = this.divisionAdaptor.getUniqueDivisionsCountBetweenDates(this.scale.startDate, new Date(item.startDate)) - 1;

    return columnsOffsetFromStart * this.zoom.columnWidth;
  }

  private _calculateItemWidth(item: ITimelineItem): number {
    if (!item.startDate || !item.endDate)
      return 0;

    const columnsOccupied = this.divisionAdaptor.getUniqueDivisionsCountBetweenDates(new Date(item.startDate), new Date(item.endDate));

    return columnsOccupied * this.zoom.columnWidth;
  }

  private _recalculateDateMarkerPosition(): void {
    const countOfColumns = this.divisionAdaptor.getDurationInDivisions(this.scale.startDate, new Date());

    this.dateMarkerLeftPosition = countOfColumns * this.zoom.columnWidth;
  }

  ngOnDestroy(): void {
  }
}
