import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
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
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements AfterViewInit, OnDestroy {
  currentDate: Date = new Date();

  dateMarkerLeftPosition = 0;

  scale: IScale | undefined;

  isItemResizingStarted = false;

  itemsBuilder = new ItemsBuilder();

  private _ignoreNextScrollEvent = false;

  @ViewChild('timeline') timelineElement: ElementRef<HTMLElement> | undefined;

  @Input() updateItemHandler: ((updatedItem: ITimelineItem, onError: () => void) => void) = () => null;

  @Input() locale: string = 'en';

  @Input() rowHeight: number = 45;

  @Input() headerHeight: number = 60;

  @Input() panelLabel: string = '';

  @Input() panelWidth: number = 160;

  @Input() panelItemTemplate: TemplateRef<{item: ITimelineItem, index: number, depth: number, locale: string}>

  @Input() itemDblClickHandler: (item: ITimelineItem) => void = () => null;

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
        .subscribe(() => this._recalculateLeftPositionForDateMarker());
    }
  }

  redraw(): void {
    this._generateScale();
    this._calculateItemsPosition();
    this._recalculateLeftPositionForDateMarker();
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
    this._cdr.markForCheck();
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
    if (!this.isItemResizingStarted) {
      const divisionCalculator = this.divisionAdaptor;
      const transferColumns = Math.round(event.distance.x / this.zoom.columnWidth);
      const newStartDate = divisionCalculator.addDivisionToDate(new Date(item.startDate), transferColumns);
      const newEndDate = divisionCalculator.addDivisionToDate(new Date(item.endDate), transferColumns);
      const oldStartDate = item.startDate;
      const oldEndDate = item.endDate;
      item.startDate = newStartDate.toISOString();
      item.endDate = newEndDate.toISOString();
      event.source._dragRef.reset();
      this._updateItemPosition(item);

      this.updateItemHandler(item, () => {
        item.startDate = oldStartDate;
        item.endDate = oldEndDate;
        this._updateItemPosition(item);
      });
    }
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
  _onItemResizeStart(event: ResizeEvent): void {
    this.isItemResizingStarted = true;
  }

  /**
   * @hidden
   */
  _onItemResizeEnd(event: ResizeEvent, item: ITimelineItem): void {
    this.isItemResizingStarted = false;
    const divisionCalculator = this.divisionAdaptor;
    const oldStartDate = item.startDate;
    const oldEndDate = item.endDate;
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
    this.updateItemHandler(item, () => {
      item.startDate = oldStartDate;
      item.endDate = oldEndDate;
      this._updateItemPosition(item);
    });
  }

  private _generateScale(): void {
    const scaleStartDate = this.scaleGenerator.getStartDateByFirstItem(this.itemsBuilder.getFirstItem(false));
    const scaleEndDate = this.scaleGenerator.getEndDateByLastItem(this.itemsBuilder.getLastItem(false));
    this.scale = this.scaleGenerator.generateScale(scaleStartDate, scaleEndDate);
  }

  private _calculateItemsPosition(): void {
    this.itemsBuilder.forEach((item) => this._updateItemPosition(item));
  }

  private _updateItemPosition(item: ITimelineItem): void {
    item.width = this._calculateItemWidth(item);
    item.left = this._calculateItemLeftOffset(item);
  }

  private _calculateItemLeftOffset(item: ITimelineItem): number {
    if (!item.startDate || !item.endDate)
      return 0;

    return this._getItemNumberOfColumnsOffsetFromStart(item) * this.zoom.columnWidth;
  }

  private _calculateItemWidth(item: ITimelineItem): number {
    if (!item.startDate || !item.endDate)
      return 0;
    return this._getNumberOfColumnsOccupiedByItem(item) * this.zoom.columnWidth;
  }

  private _recalculateLeftPositionForDateMarker(): void {
    const countOfColumns = this.divisionAdaptor.getDurationInDivisions(this.scale.startDate, new Date());

    this.dateMarkerLeftPosition = countOfColumns * this.zoom.columnWidth;
  }

  private _getNumberOfColumnsOccupiedByItem(item: ITimelineItem): number {
    return this.divisionAdaptor.getUniqueDivisionsCountBetweenDates(new Date(item.startDate), new Date(item.endDate));
  }

  private _getItemNumberOfColumnsOffsetFromStart(item: ITimelineItem): number {
    return this.divisionAdaptor.getUniqueDivisionsCountBetweenDates(this.scale.startDate, new Date(item.startDate)) - 1;
  }

  ngOnDestroy(): void {
  }
}
