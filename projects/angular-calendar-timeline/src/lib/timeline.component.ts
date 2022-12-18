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
  OnDestroy,
  Output,
  PLATFORM_ID,
  TemplateRef,
} from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { interval, Subject, takeUntil } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  IDivisionAdaptor,
  IIdObject,
  IItemsBuilder,
  IScale,
  IScaleGenerator,
  ITimelineItem,
  ITimelineZoom
} from './models';
import { isPlatformBrowser } from "@angular/common";
import { MillisecondsToTime } from "./helpers/date-helpers";
import { ItemsBuilder } from "./items-builder/items-builder";
import { ZoomsBuilder } from "./zooms-builder/zooms-builder";
import { DefaultZooms } from "./zooms-builder/zooms";
import { DragEndEvent } from "angular-draggable-droppable/lib/draggable.directive";
import { StrategyManager } from "./strategy-manager";

@Component({
  selector: 'timeline-calendar',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements AfterViewInit, OnDestroy {
  /**
   * Indicates the current shown date in the middle of user`s screen.
   */
  public currentDate: Date = new Date();

  /**
   *  Scale generator changes depending on current view type.
   */
  public scaleGenerator: IScaleGenerator;

  /**
   * Division adapter changes depending on current view type.
   */
  public divisionAdaptor: IDivisionAdaptor;

  public dateMarkerLeftPosition: number = 0;

  public scale: IScale | undefined;

  public itemsBuilder: IItemsBuilder = new ItemsBuilder();

  public zoomsBuilder: ZoomsBuilder = new ZoomsBuilder(DefaultZooms);

  private _ignoreNextScrollEvent: boolean = false;

  private _destroy$: Subject<void> = new Subject<void>();

  /**
   * Emits event when startDate and endDate of some item was changed by moving it.
   */
  @Output() itemMoved: EventEmitter<ITimelineItem> = new EventEmitter<ITimelineItem>();

  /**
   * Emits event when startDate or endDate of some item was changed by resizing it.
   */
  @Output() itemResized: EventEmitter<ITimelineItem> = new EventEmitter<ITimelineItem>();
  /**
   * Emits event when current zoom was changed.
   */
  @Output() zoomChanged: EventEmitter<ITimelineZoom> = new EventEmitter<ITimelineZoom>();

  /**
   * The locale used to format dates. By default is 'en'
   */
  @Input() locale: string = 'en';

  /**
   * Height of the each row. By default is 40.
   */
  @Input() rowHeight: number = 40;

  /**
   * Height of the each timeline item. Can't be bigger then 'rowHeight' property. By default is 30.
   */
  @Input() itemHeight: number = 30;

  /**
   * Height of top dates panel. By default is 60.
   */
  @Input() headerHeight: number = 60;

  /**
   * The label of left panel. By default is empty.
   */
  @Input() panelLabel: string = '';

  /**
   * Width of left panel. By default is 160.
   */
  @Input() panelWidth: number = 160;

  /**
   * Minimal width of left panel. By default is 50.
   */
  @Input() minPanelWidth: number = 50;

  /**
   * Maximal width of left panel. By default is 400.
   */
  @Input() maxPanelWidth: number = 400;

  /**
   * Can resize panel. By default is true.
   */
  @Input() panelResizable: boolean = true;

  /**
   * Custom template for item in left panel.
   */
  @Input() panelItemTemplate: TemplateRef<{ item: ITimelineItem, index: number, depth: number, locale: string }>

  /**
   * Custom template for item in timeline.
   */
  @Input() itemContentTemplate: TemplateRef<{ $implicit: ITimelineItem, locale: string }> | undefined;

  /**
   * If false then date marker will be not visible.
   */
  @Input() showDateMarket: boolean = true;

  /**
   * Custom template for marker that indicates current time.
   */
  @Input() dateMarkerTemplate: TemplateRef<{ leftPosition: number }> | undefined;

  /**
   * Register array of custom zooms.
   * Current zoom can be changed to any existed in this array by calling method "changeZoom()"
   */
  @Input() set zooms(value: ITimelineZoom[]) {
    this.zoomsBuilder.setZooms(value);
  }

  /**
   * The items of timeline.
   */
  @Input()
  set items(items: ITimelineItem[]) {
    this.itemsBuilder.setItems(items);
    this.redraw();
  }

  /**
   * Visible timeline width (container visible width - panel width = timeline visible width).
   */
  get visibleScaleWidth(): number {
    return this._elementRef.nativeElement.clientWidth - this.panelWidth;
  }

  /**
   * Active zoom.
   */
  get zoom(): ITimelineZoom {
    return this.zoomsBuilder.activeZoom;
  }

  /**
   * Registered zooms list.
   */
  get zooms(): ITimelineZoom[] {
    return this.zoomsBuilder.zooms;
  }

  constructor(private _cdr: ChangeDetectorRef,
              private _strategyManager: StrategyManager,
              @Inject(ElementRef) private _elementRef: ElementRef,
              @Inject(PLATFORM_ID) private _platformId: object) {
    this._setStrategies(this.zoom);
  }

  ngAfterViewInit(): void {
    this.zoomsBuilder.activeZoom$
      .pipe(takeUntil(this._destroy$))
      .subscribe((zoom) => {
        this._setStrategies(zoom);
        this.zoomChanged.emit(zoom);
        this.redraw();
      });

    if (isPlatformBrowser(this._platformId)) {
      interval(MillisecondsToTime.Minute)
        .pipe(startWith(''), takeUntil(this._destroy$))
        .subscribe(() => this._recalculateDateMarkerPosition());
    }
  }

  /**
   * Recalculate and update view.
   */
  redraw(): void {
    this._generateScale();
    this._updateItemsPosition();
    this._recalculateDateMarkerPosition();
    this._ignoreNextScrollEvent = true;
    this._cdr.detectChanges();
    this.attachCameraToDate(this.currentDate);
  }

  /**
   * Set horizontal scroll in the middle of the date
   */
  attachCameraToDate(date: Date): void {
    this.currentDate = date;
    const duration = this.divisionAdaptor.getDurationInDivisions(this.scale.startDate, date);
    const scrollLeft = (duration * this.zoom.columnWidth) - (this.visibleScaleWidth / 2);
    this._ignoreNextScrollEvent = true;

    if (this._elementRef.nativeElement) {
      this._elementRef.nativeElement.scrollLeft = scrollLeft < 0 ? 0 : scrollLeft;
    }
  }

  /**
   * Automatically chooses the most optimal zoom and sets horizontal scroll to the center of the items.
   * Padding sets minimal spacing from left and right to the first and last items.
   */
  fitToContent(paddings: number): void {
    const firstItem = this.itemsBuilder.getFirstItem(true);
    const lastItem = this.itemsBuilder.getLastItem(true);

    if (!firstItem || !lastItem)
      return;

    const startDate = new Date(firstItem.startDate);
    const endDate = new Date(lastItem.endDate);
    const zoom = this._calculateOptimalZoom(startDate, endDate, paddings);
    const divisionAdaptor = this._strategyManager.getAdaptor(zoom.division);

    this.currentDate = new Date(divisionAdaptor.getMiddleDate(startDate, endDate));

    if (this.zoomsBuilder.isZoomActive(zoom)) {
      this.attachCameraToDate(this.currentDate);
    } else {
      this.changeZoom(zoom);
    }
  }

  /**
   * Change zoom to one of the existed
   */
  changeZoom(zoom: ITimelineZoom): void {
    this.zoomsBuilder.changeActiveZoom(zoom);
  }

  /**
   * Changes zoom to the max value
   */
  zoomFullIn(): void {
    this.zoomsBuilder.changeActiveZoom(this.zoomsBuilder.getLastZoom());
  }

  /**
   * Changes zoom to the min value
   */
  zoomFullOut(): void {
    this.zoomsBuilder.changeActiveZoom(this.zoomsBuilder.getFirstZoom());
  }

  /**
   * Changes zoom for 1 step back
   */
  zoomIn(): void {
    this.zoomsBuilder.zoomIn();
  }

  /**
   * Changes zoom for 1 step forward
   */
  zoomOut(): void {
    this.zoomsBuilder.zoomOut();
  }


  private _calculateOptimalZoom(startDate: Date, endDate: Date, paddings = 15): ITimelineZoom {
    let possibleZoom: ITimelineZoom = this.zoomsBuilder.getFirstZoom();

    for (let i = this.zoomsBuilder.getLastZoom().index; i >= this.zoomsBuilder.getFirstZoom().index; i--) {
      const currentZoom = this.zoomsBuilder.zooms[i];
      const divisionCalculator = this._strategyManager.getAdaptor(currentZoom.division);
      const countOfColumns = divisionCalculator.getUniqueDivisionsCountBetweenDates(startDate, endDate);

      if (countOfColumns * currentZoom.columnWidth < (this.visibleScaleWidth - paddings * 2)) {
        possibleZoom = currentZoom;
        break;
      }
    }

    return possibleZoom;
  }

  _getCurrentDate(): Date {
    const currentScrollLeft = this._elementRef.nativeElement.scrollLeft ?? 0;
    const scrollLeftToCenterScreen = currentScrollLeft + (this.visibleScaleWidth / 2);
    const columns = Math.round(scrollLeftToCenterScreen / this.zoom.columnWidth);

    return this.divisionAdaptor.addDivisionToDate(this.scale.startDate, columns);
  }

  _onItemMoved(event: DragEndEvent, item: ITimelineItem): void {
    const divisionCalculator = this.divisionAdaptor;
    const transferColumns = Math.round(event.x / this.zoom.columnWidth);
    item.startDate = divisionCalculator.addDivisionToDate(new Date(item.startDate), transferColumns);
    item.endDate = divisionCalculator.addDivisionToDate(new Date(item.endDate), transferColumns);
    this._updateItemPosition(item);
    this.itemMoved.emit(item);
  }

  _trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }

  _onItemResized(event: ResizeEvent, item: ITimelineItem): void {
    const calculateNewDate = (movedPx: number, oldDate: Date): Date => {
      const countOfColumnsMoved = Math.round(movedPx as number / this.zoom.columnWidth);
      return this.divisionAdaptor.addDivisionToDate(oldDate, countOfColumnsMoved);
    }

    if (event.edges.left) {
      const newStartDate = calculateNewDate(<number>event.edges.left, new Date(item.startDate));
      if (newStartDate.getTime() <= new Date(item.endDate).getTime()) {
        item.startDate = newStartDate;
      }
    } else {
      const newEndDate = calculateNewDate(<number>event.edges.right, new Date(item.endDate));
      if (newEndDate.getTime() >= new Date(item.startDate).getTime()) {
        item.endDate = newEndDate;
      }
    }

    this._updateItemPosition(item);
    this.itemResized.emit(item);
  }

  @HostListener('scroll', ['$event'])
  private _onScroll(event: Event): void {
    if (!this._ignoreNextScrollEvent) {
      this.currentDate = this._getCurrentDate();
    }
    this._ignoreNextScrollEvent = false;
  }

  private _generateScale(): void {
    const scaleStartDate = this.scaleGenerator.getStartDate(this.itemsBuilder);
    const scaleEndDate = this.scaleGenerator.getEndDate(this.itemsBuilder);
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

  private _setStrategies(zoom: ITimelineZoom): void {
    this.divisionAdaptor = this._strategyManager.getAdaptor(zoom.division);
    this.scaleGenerator = this._strategyManager.getGenerator(zoom.division);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
