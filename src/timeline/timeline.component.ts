import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, Inject,
  Input,
  OnDestroy, Output, PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ScaleGeneratorsFactory } from './scale-generator/scale-generators-factory';
import { ResizeEvent } from 'angular-resizable-element';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import {
  ITimelineGroup,
  ITimelineItem,
  TimelineMaxZoomIndex,
  TimelineZooms,
  ITimelineZoom, ITimelineState, IIdObject, TimelineMinZoomIndex,
} from './models';
import { interval } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { startWith } from 'rxjs/operators';
import { TimelineDivisionsCalculatorFactory } from './zoom-handler/divisions-calculator-factory';
import { IScale, IScaleGenerator } from './scale-generator/models';
import { ITimelineDivisionCalculator } from './zoom-handler/models';
import { isPlatformBrowser } from "@angular/common";
import { DateHelpers } from "./date-helpers";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements AfterViewInit, OnDestroy {
  currentDate: Date = new Date();
  timelineMarkerLeft = 0;
  zoom: ITimelineZoom = TimelineZooms[TimelineMaxZoomIndex];
  groups: ITimelineGroup[] = [];
  scaleStartDate: Date = new Date();
  scaleEndDate: Date | undefined;
  scale: IScale | undefined;
  isItemResizingStarted = false;
  scaleGeneratorsFactory = new ScaleGeneratorsFactory();
  divisionsCalculatorFactory = new TimelineDivisionsCalculatorFactory();

  private _ignoreNextScrollEvent = false;
  private _items: ITimelineItem[] = [];

  @ViewChild('timeline') timelineElement: ElementRef<HTMLElement> | undefined;

  @Output() stateChange = new EventEmitter<ITimelineState>();

  @Input() updateItemHandler: ((updatedItem: ITimelineItem, onError?: () => void) => void) = () => null;
  @Input() groupsTitle: string = '';
  @Input() rowHeight: number = 45;
  @Input() groupsPanelWidth: number = 160;
  @Input() itemContentTemplate: TemplateRef<any> | undefined;
  @Input() itemsToGroups: (items: ITimelineItem[]) => ITimelineGroup[] = (items) => [];
  @Input() itemDblClickHandler: (item: ITimelineItem) => void = () => null;

  @Input()
  set items(items) {
    this._items = items;
    this._setGroups();
    this.redraw();
    this.scrollToDate(this.currentDate);
  }

  get items() {
    return this._items;
  }

  get timelineNativeElement(): HTMLElement | undefined {
    return this.timelineElement?.nativeElement;
  }

  get columnWidth(): number {
    return this.zoom.columnWidth;
  }

  get visibleScaleWidth(): number {
    return this.timelineNativeElement ? this.timelineNativeElement.clientWidth - this.groupsPanelWidth : 0;
  }

  get zoomHandler(): ITimelineDivisionCalculator {
    return this.divisionsCalculatorFactory.getDivisionCalculator(this.zoom.division);
  }

  get scaleGenerator(): IScaleGenerator {
    return this.scaleGeneratorsFactory.getGenerator(this.zoom);
  }

  get scrollLeft(): number {
    return this.timelineNativeElement?.scrollLeft ?? 0;
  }

  set scrollLeft(width: number) {
    if (this.timelineNativeElement) {
      this.timelineNativeElement.scrollLeft = width;
    }
  }

  constructor(private _cdr: ChangeDetectorRef,
              private _router: Router,
              private _route: ActivatedRoute,
              @Inject(PLATFORM_ID) private _platformId: object) {
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this._platformId)) {
      const oneMinute = 1000 * 60;
      interval(oneMinute)
        .pipe(startWith(''), untilDestroyed(this))
        .subscribe(() => this._recalculateLeftPositionForDateMarker());
    }
  }

  onScroll(event: Event): void {
    this._cdr.markForCheck();
    if (!this._ignoreNextScrollEvent) {
      this.currentDate = this.getCurrentDate();
    }
    this._ignoreNextScrollEvent = false;
  }

  changeZoom({
               zoom,
               date,
               emitStateChange = true
             }: { zoom?: ITimelineZoom, date?: Date, emitStateChange?: boolean }): void {
    if (!zoom || this.zoom.index === zoom.index && !date)
      return;

    this.zoom = zoom;
    this.redraw();
    this.scrollToDate(date ? date : this.currentDate);

    if (emitStateChange) {
      this.stateChange.emit(this.getState());
    }
  }

  scrollToDate(date: Date): void {
    if (!this.timelineElement || !date)
      return;

    const duration = this.zoomHandler.getDurationInDivisions(this.scaleStartDate, date);
    const scrollLeft = (duration * this.columnWidth) - (this.visibleScaleWidth / 2);
    this.currentDate = date;
    this._ignoreNextScrollEvent = true;
    this.scrollLeft = scrollLeft < 0 ? 0 : scrollLeft;
  }

  redraw(): void {
    this.scaleStartDate = this.scaleGenerator.validateStartDate(this._getScaleStartDate());
    this.scaleEndDate = this.scaleGenerator.validateEndDate(this._getScaleEndDate());
    this.scale = this.scaleGenerator.getScale(this.scaleStartDate, this.scaleEndDate);

    this._calculateItemsPosition();
    this._recalculateLeftPositionForDateMarker();
    this._ignoreNextScrollEvent = true;
    this._cdr.detectChanges();
  }

  getCurrentDate(): Date {
    const scrollLeftToCenterScreen = this.scrollLeft + (this.visibleScaleWidth / 2);
    const columns = Math.round(scrollLeftToCenterScreen / this.columnWidth);

    return this.zoomHandler.addDivisionToDate(this.scaleStartDate, columns);
  }

  onItemDropped(event: CdkDragEnd, item: ITimelineItem): void {
    if (!this.isItemResizingStarted) {
      const handler = this.zoomHandler;
      const transferColumns = Math.round(event.distance.x / this.columnWidth);
      const newStartDate = handler.addDivisionToDate(new Date(item.startDate), transferColumns);
      const newEndDate = handler.addDivisionToDate(new Date(item.endDate), transferColumns);
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

  trackById(index: number, item: IIdObject): number | string {
    return item.id;
  }

  onItemResizeStart(event: ResizeEvent): void {
    this.isItemResizingStarted = true;
  }

  onItemResizeEnd(event: ResizeEvent, item: ITimelineItem): void {
    this.isItemResizingStarted = false;
    const handler = this.zoomHandler;
    const oldStartDate = item.startDate;
    const oldEndDate = item.endDate;

    const {left, right} = event.edges;

    if (left) {
      const countOfColumnsMoved = Math.round(left as number / this.columnWidth);
      const newStartDate = handler.addDivisionToDate(new Date(item.startDate), countOfColumnsMoved);
      if (newStartDate.getTime() > new Date(item.endDate).getTime()) {
        return;
      }
      item.startDate = newStartDate.toISOString();
    } else {
      const countOfColumnsMoved = Math.round(right as number / this.columnWidth);
      const newEndDate = handler.addDivisionToDate(new Date(item.endDate), countOfColumnsMoved);
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

  handleGroupClick(group: ITimelineGroup): void {
    group.expanded = !group.expanded;
  }

  handleGroupsPanelResize(event: ResizeEvent) {
    if (event.rectangle.width) {
      this.groupsPanelWidth = event.rectangle.width;
    }
  }

  private _calculateItemsPosition(): void {
    this._items.forEach(item => this._updateItemPosition(item));
  }

  private _updateItemPosition(item: ITimelineItem): void {
    item.width = this._calculateItemWidth(item);
    item.left = this._calculateItemLeftOffset(item);
    if (item.onUpdate) {
      item.onUpdate();
    }
  }

  private _calculateItemLeftOffset(item: ITimelineItem): number {
    if (!item.startDate || !item.endDate)
      return 0;
    return this._getItemNumberOfColumnsOffsetFromStart(item) * this.columnWidth;
  }

  private _calculateItemWidth(item: ITimelineItem): number {
    if (!item.startDate || !item.endDate)
      return 0;
    return this._getNumberOfColumnsOccupiedByItem(item) * this.columnWidth;
  }

  private _getScaleStartDate(): Date {
    const firstItemTime = this.getFirstItemTime();
    const now = Date.now();

    return new Date(firstItemTime < now ? firstItemTime : now);
  }

  private _getScaleEndDate(): Date {
    const lastItemTime = this.getLastItemTime();
    const now = Date.now();

    return new Date(lastItemTime < now ? now : lastItemTime);
  }

  getFirstItemTime(): number {
    return this._items.reduce((minTime: number, item: ITimelineItem) => {
      if (!item.startDate)
        return minTime;
      const itemTime = new Date(item.startDate).getTime();
      return itemTime < minTime ? itemTime : minTime;
    }, new Date().getTime());
  }

  getLastItemTime(): number {
    const firstItem = this._items && this._items[0];
    const initialTime = firstItem ? new Date(firstItem.endDate).getTime() : Date.now();

    return this._items.reduce((maxTime: number, item: ITimelineItem) => {
      if (!item.endDate)
        return maxTime;
      const itemTime = new Date(item.endDate).getTime();
      return itemTime > maxTime ? itemTime : maxTime;
    }, initialTime);
  }

  getState(): ITimelineState {
    return {
      zoom: this.zoom,
      currentDate: this.currentDate.toISOString(),
    };
  }

  loadState(state: ITimelineState): void {
    if (!state)
      return;

    this.changeZoom({
      zoom: state.zoom,
      date: new Date(state.currentDate ?? new Date()),
      emitStateChange: false,
    });
  }

  private _setGroups(): void {
    const groups = this.itemsToGroups(this._items);
    forEachTimelineGroup(groups, (group) => {
      this._calculateGroupsHeight(group);
      this._sortGroupItems(group);
    });

    this.groups = groups;
  }

  private _calculateGroupsHeight(group: ITimelineGroup): void {
    group.height = (group.items && group.items.length || 1) * this.rowHeight;
  }

  private _sortGroupItems(group: ITimelineGroup): void {
    (group.items ?? []).sort((a, b) => {
      return new Date(a.startDate).getTime() > new Date(b.startDate).getTime() ? 1 : -1;
    });
  }

  private _recalculateLeftPositionForDateMarker(): void {
    const countOfColumns = this.zoomHandler.getDurationInDivisions(this.scaleStartDate, new Date());

    this.timelineMarkerLeft = countOfColumns * this.columnWidth;
  }

  private _getNumberOfColumnsOccupiedByItem(item: ITimelineItem): number {
    return this.zoomHandler.getUniqueDivisionsCountBetweenDates(new Date(item.startDate), new Date(item.endDate));
  }

  private _getItemNumberOfColumnsOffsetFromStart(item: ITimelineItem): number {
    return this.zoomHandler.getUniqueDivisionsCountBetweenDates(this.scaleStartDate, new Date(item.startDate)) - 1;
  }

  zoomIn(): void {
    let newZoomIndex = this.zoom.index + 1;
    if (newZoomIndex > TimelineMaxZoomIndex) {
      newZoomIndex = TimelineMaxZoomIndex;
    }

    this.changeZoom({zoom: TimelineZooms[newZoomIndex]});
  }

  zoomOut(): void {
    let newZoomIndex = this.zoom.index - 1;
    if (newZoomIndex < TimelineMinZoomIndex) {
      newZoomIndex = TimelineMinZoomIndex;
    }

    this.changeZoom({zoom: TimelineZooms[newZoomIndex]});
  }

  fitToContent(): void {
    const startDate = new Date(this.getFirstItemTime());
    const endDate = new Date(this.getLastItemTime());
    let chosenZoom = TimelineZooms[TimelineMinZoomIndex];
    let averageTime: number;

    for (let i = TimelineMaxZoomIndex; i >= TimelineMinZoomIndex; i--) {
      const currentZoom = TimelineZooms[i];
      const divisionCalculator = this.divisionsCalculatorFactory.getDivisionCalculator(currentZoom.division);
      const countOfColumns = divisionCalculator.getUniqueDivisionsCountBetweenDates(startDate, endDate);

      const paddings = 15;

      if (countOfColumns * currentZoom.columnWidth < (this.visibleScaleWidth - paddings * 2)) {
        chosenZoom = currentZoom;
        averageTime = divisionCalculator.getTimeInDivisionsCenter(startDate, endDate);
        break;
      }

    }

    this.changeZoom( {zoom: chosenZoom, date: new Date(averageTime)});
  }

  ngOnDestroy(): void {
  }
}

function forEachTimelineGroup(groups: ITimelineGroup[], handler: (group: ITimelineGroup) => void): void {
  (groups || []).forEach(group => {
    handler(group);
    if (group.groups) {
      forEachTimelineGroup(group.groups, handler);
    }
  });
}
