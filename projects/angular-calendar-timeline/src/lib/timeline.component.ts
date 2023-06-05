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
  IViewModeAdaptor,
  IIdObject,
  IItemsIterator,
  IScale,
  IScaleGenerator,
  ITimelineItem,
  ITimelineZoom, IZoomsHandler, IScaleColumn, IItemTimeChangedEvent, IItemRowChangedEvent
} from './models';
import { isPlatformBrowser } from "@angular/common";
import { MillisecondsToTime } from "./helpers/date-helpers";
import { ItemsIterator } from "./items-iterator/items-iterator";
import { ZoomsHandler } from "./zooms-handler/zooms-handler";
import { DefaultZooms } from "./zooms-handler/zooms";
import { DragEndEvent } from "angular-draggable-droppable/lib/draggable.directive";
import { StrategyManager } from "./strategy-manager";
import { RowDeterminant } from "./helpers/row-determinant";

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
   * View mode adaptor changes depending on current view type.
   */
  public viewModeAdaptor: IViewModeAdaptor;

  public dateMarkerLeftPosition: number = 0;

  public scale: IScale | undefined;

  public itemsIterator: IItemsIterator = new ItemsIterator();

  public zoomsHandler: IZoomsHandler = new ZoomsHandler(DefaultZooms);

  private _ignoreNextScrollEvent: boolean = false;

  private _destroy$: Subject<void> = new Subject<void>();

  /**
   * Emits event when startDate and endDate of some item was changed by resizing/moving it.
   */
  @Output() itemTimeChanged: EventEmitter<IItemTimeChangedEvent> = new EventEmitter();

  /**
   * Emits event when item was moved by Y axis.
   */
  @Output() itemRowChanged: EventEmitter<IItemRowChangedEvent> = new EventEmitter();

  /**
   * Emits event when current zoom was changed.
   */
  @Output() zoomChanged: EventEmitter<ITimelineZoom> = new EventEmitter<ITimelineZoom>();

  /**
   * Emits event when user clicked somewhere on time grid.
   */
  @Output() timeGridClicked: EventEmitter<{originalEvent: Event, row: ITimelineItem, column: IScaleColumn}> = new EventEmitter();

  /**
   * The locale used to format dates. By default is 'en'
   */
  @Input() locale: string = 'en';

  /**
   * Height of the each row in pixels. By default is 40.
   */
  @Input() rowHeight: number = 40;

  /**
   * Height of the each timeline item in pixels. Can't be bigger then 'rowHeight' property. By default is 30.
   */
  @Input() itemHeight: number = 30;

  /**
   * Height of top dates panel in pixels. By default is 60.
   */
  @Input() headerHeight: number = 60;

  /**
   * The label of left panel. By default is empty.
   */
  @Input() panelLabel: string = '';

  /**
   * Width of left panel in pixels. By default is 160.
   */
  @Input() panelWidth: number = 160;

  /**
   * Minimal width of left panel in pixels. By default is 50.
   */
  @Input() minPanelWidth: number = 50;

  /**
   * Maximal width of left panel in pixels. By default is 400.
   */
  @Input() maxPanelWidth: number = 400;

  /**
   *  Sets the left displacement in pixels between parent and child groups in left panel. By default is 15.
   */
  @Input() offsetForChildPanelItem: number = 15;

  /**
   * Can resize panel. By default is true.
   */
  @Input() isPanelResizable: boolean = true;

  /**
   * If false then date marker will be not visible.
   */
  @Input() showDateMarket: boolean = true;

  /**
   * Custom template for item in left panel.
   */
  @Input() panelItemTemplate: TemplateRef<{ item: ITimelineItem, index: number, depth: number, locale: string }>

  /**
   * Custom template for item in timeline.
   */
  @Input() itemContentTemplate: TemplateRef<{ $implicit: ITimelineItem, locale: string }> | undefined;

  /**
   * Custom template for separators between columns.
   */
  @Input() columnSeparatorTemplate: TemplateRef<{column: IScaleColumn, index: number, columnWidth: number, headerHeight: number}> | undefined;

  /**
   * Custom template for marker that indicates current time.
   */
  @Input() dateMarkerTemplate: TemplateRef<{ leftPosition: number }> | undefined;

  /**
   * Register array of custom zooms.
   * Current zoom can be changed to any existed in this array by calling method "changeZoom()"
   */
  @Input() set zooms(value: ITimelineZoom[]) {
    this.zoomsHandler.setZooms(value);
  }

  /**
   * The items of timeline.
   */
  @Input()
  set items(items: ITimelineItem[]) {
    this.itemsIterator.setItems(items);
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
    return this.zoomsHandler.activeZoom;
  }

  /**
   * Registered zooms list.
   */
  get zooms(): ITimelineZoom[] {
    return this.zoomsHandler.zooms;
  }

  constructor(private _cdr: ChangeDetectorRef,
              private _strategyManager: StrategyManager,
              @Inject(ElementRef) private _elementRef: ElementRef,
              @Inject(PLATFORM_ID) private _platformId: object) {
    this._setStrategies(this.zoom);
  }

  ngAfterViewInit(): void {
    this.zoomsHandler.activeZoom$
      .pipe(takeUntil(this._destroy$))
      .subscribe((zoom) => {
        this._setStrategies(zoom);
        this.redraw();
        this.zoomChanged.emit(zoom);
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
    this.itemsIterator.setItems([...this.itemsIterator.items]);
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
    const duration = this.viewModeAdaptor.getDurationInColumns(this.scale.startDate, date);
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
    const firstItem = this.itemsIterator.getFirstItem(true);
    const lastItem = this.itemsIterator.getLastItem(true);

    if (!firstItem || !lastItem)
      return;

    const startDate = new Date(firstItem.startDate);
    const endDate = new Date(lastItem.endDate);
    const zoom = this._calculateOptimalZoom(startDate, endDate, paddings);
    const viewModeAdaptor = this._strategyManager.getViewModeAdaptor(zoom.viewMode);

    this.currentDate = new Date(viewModeAdaptor.getMiddleDate(startDate, endDate));

    if (this.zoomsHandler.isZoomActive(zoom)) {
      this.attachCameraToDate(this.currentDate);
    } else {
      this.changeZoom(zoom);
    }
  }

  /**
   * Change zoom to one of the existed
   */
  changeZoom(zoom: ITimelineZoom): void {
    this.zoomsHandler.changeActiveZoom(zoom);
  }

  /**
   * Changes zoom to the max value
   */
  zoomFullIn(): void {
    this.zoomsHandler.changeActiveZoom(this.zoomsHandler.getLastZoom());
  }

  /**
   * Changes zoom to the min value
   */
  zoomFullOut(): void {
    this.zoomsHandler.changeActiveZoom(this.zoomsHandler.getFirstZoom());
  }

  /**
   * Changes zoom for 1 step back
   */
  zoomIn(): void {
    this.zoomsHandler.zoomIn();
  }

  /**
   * Changes zoom for 1 step forward
   */
  zoomOut(): void {
    this.zoomsHandler.zoomOut();
  }

  /**
   * Accepts the relative coordinates to the timeline container and returns the row and column.
   */
  getCellByCoordinates(x: number, y: number): {row: ITimelineItem | undefined, column: IScaleColumn} {
    const rowDeterminant = new RowDeterminant(this.itemsIterator);
    const rowIndex = Math.floor((y - this.headerHeight) / this.rowHeight);
    const row: ITimelineItem = rowDeterminant.getStreamByRowIndex(rowIndex);

    const columnIndex = Math.floor((x - this.panelWidth) / this.zoom.columnWidth);
    const column: IScaleColumn = this.scale.columns[columnIndex];

    return {column, row};
  }

  _getCurrentDate(): Date {
    const currentScrollLeft = this._elementRef.nativeElement.scrollLeft ?? 0;
    const scrollLeftToCenterScreen = currentScrollLeft + (this.visibleScaleWidth / 2);
    const columns = Math.round(scrollLeftToCenterScreen / this.zoom.columnWidth);

    return this.viewModeAdaptor.addColumnToDate(this.scale.startDate, columns);
  }

  _onItemMoved(event: DragEndEvent, item: ITimelineItem): void {
    if (event.y) {
      this._onItemMovedVertically(event, item);
    }

    if (event.x) {
      this._onItemMovedHorizontally(event, item);
    }
  }

  private _onItemMovedHorizontally(event: DragEndEvent, item: ITimelineItem): void {
    const transferColumns = Math.round(event.x / this.zoom.columnWidth);
    const newStartDate = this.viewModeAdaptor.addColumnToDate(new Date(item.startDate), transferColumns);
    const newEndDate = this.viewModeAdaptor.addColumnToDate(new Date(item.endDate), transferColumns);
    this.itemTimeChanged.emit({item, newStartDate, newEndDate});
  }

  private _onItemMovedVertically(event: DragEndEvent, item: ITimelineItem): void {
    const rowDeterminant = new RowDeterminant(this.itemsIterator);
    const rowIndex = rowDeterminant.getRowIndexByItem(item);
    const transferRows = event.y / this.rowHeight;
    const newRowIndex = rowIndex + transferRows;

    if (rowIndex === newRowIndex)
      return;

    const oldRow = rowDeterminant.getStreamByRowIndex(rowIndex);
    const newRow = rowDeterminant.getStreamByRowIndex(newRowIndex);

    this.itemRowChanged.emit({item, oldRow, newRow});
  }

  private _calculateOptimalZoom(startDate: Date, endDate: Date, paddings = 15): ITimelineZoom {
    let possibleZoom: ITimelineZoom = this.zoomsHandler.getFirstZoom();

    for (let i = this.zoomsHandler.getLastZoom().index; i >= this.zoomsHandler.getFirstZoom().index; i--) {
      const currentZoom = this.zoomsHandler.zooms[i];
      const viewModeAdaptor = this._strategyManager.getViewModeAdaptor(currentZoom.viewMode);
      const countOfColumns = viewModeAdaptor.getUniqueColumnsWithinRange(startDate, endDate);

      if (countOfColumns * currentZoom.columnWidth < (this.visibleScaleWidth - paddings * 2)) {
        possibleZoom = currentZoom;
        break;
      }
    }

    return possibleZoom;
  }

  _trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }

  _handleContentClick(event: MouseEvent): void {
    const scrollLeft: number = this._elementRef.nativeElement.scrollLeft;
    const scrollTop: number = this._elementRef.nativeElement.scrollTop;
    const rect = this._elementRef.nativeElement.getBoundingClientRect();
    const xClick = event.clientX - rect.left + scrollLeft;
    const yClick = event.clientY - rect.top + scrollTop;
    const cell = this.getCellByCoordinates(xClick, yClick);

    this.timeGridClicked.emit({originalEvent: event, column: cell.column, row: cell.row});
  }

  _onItemResized(event: ResizeEvent, item: ITimelineItem): void {
    const calculateNewDate = (movedPx: number, oldDate: Date): Date => {
      const countOfColumnsMoved = Math.round(movedPx as number / this.zoom.columnWidth);
      return this.viewModeAdaptor.addColumnToDate(oldDate, countOfColumnsMoved);
    }

    if (event.edges.left) {
      const newStartDate = this.viewModeAdaptor.setDateToStartOfColumn(
        calculateNewDate(<number>event.edges.left, new Date(item.startDate))
      );
      const isNewStartDateValid: boolean =
        this.viewModeAdaptor.setDateToStartOfColumn(newStartDate).getTime() <= new Date(item.endDate).getTime();
      if (isNewStartDateValid) {
        this.itemTimeChanged.emit({item, newStartDate});
      }
    } else {
      const newEndDate = calculateNewDate(<number>event.edges.right, new Date(item.endDate));
      const isNewEndDateValid: boolean =
        this.viewModeAdaptor.setDateToEndOfColumn(newEndDate).getTime() >= new Date(item.startDate).getTime();
      if (isNewEndDateValid) {
        this.itemTimeChanged.emit({item, newEndDate});
      }
    }
  }

  @HostListener('scroll', ['$event'])
  private _onScroll(event: Event): void {
    if (!this._ignoreNextScrollEvent) {
      this.currentDate = this._getCurrentDate();
    }
    this._ignoreNextScrollEvent = false;
  }

  private _generateScale(): void {
    const scaleStartDate = this.scaleGenerator.getStartDate(this.itemsIterator);
    const scaleEndDate = this.scaleGenerator.getEndDate(this.itemsIterator);
    this.scale = this.scaleGenerator.generateScale(scaleStartDate, scaleEndDate);
  }

  private _updateItemsPosition(): void {
    this.itemsIterator.forEach((item) => this._updateItemPosition(item));
  }

  private _updateItemPosition(item: ITimelineItem): void {
    item._width = this._calculateItemWidth(item);
    item._left = this._calculateItemLeftPosition(item);
    item.updateView && item.updateView();
  }

  private _calculateItemLeftPosition(item: ITimelineItem): number {
    if (!item.startDate || !item.endDate)
      return 0;

    const columnsOffsetFromStart = this.viewModeAdaptor.getUniqueColumnsWithinRange(this.scale.startDate, new Date(item.startDate)) - 1;

    return columnsOffsetFromStart * this.zoom.columnWidth;
  }

  private _calculateItemWidth(item: ITimelineItem): number {
    if (!item.startDate || !item.endDate)
      return 0;

    const columnsOccupied = this.viewModeAdaptor.getUniqueColumnsWithinRange(new Date(item.startDate), new Date(item.endDate));

    return columnsOccupied * this.zoom.columnWidth;
  }

  private _recalculateDateMarkerPosition(): void {
    const countOfColumns = this.viewModeAdaptor.getDurationInColumns(this.scale.startDate, new Date());

    this.dateMarkerLeftPosition = countOfColumns * this.zoom.columnWidth;
  }

  private _setStrategies(zoom: ITimelineZoom): void {
    this.viewModeAdaptor = this._strategyManager.getViewModeAdaptor(zoom.viewMode);
    this.scaleGenerator = this._strategyManager.getScaleGenerator(zoom.viewMode);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
