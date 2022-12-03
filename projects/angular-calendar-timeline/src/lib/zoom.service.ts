import { Inject, Injectable } from "@angular/core";
import { TimelineDivisionsAdaptorsManager } from "./divisions-calculator/divisions-adaptors-factory";
import { ZOOMS } from "./zooms";
import { ITimelineZoom } from "./models";
import { BehaviorSubject, Observable } from "rxjs";
import { TimelineComponent } from "./timeline.component";

@Injectable()
export class ZoomService {
  /**
   * Emits value when zoom changed
   */
  zoom$: Observable<ITimelineZoom>;

  private _zoomSubject = new BehaviorSubject<ITimelineZoom>(this._zooms[this._getMaxZoomIndex()]);

  private _component: TimelineComponent;

  /**
   * Current zoom
   */
  get zoom(): ITimelineZoom {
    return this._zoomSubject.value;
  }

  constructor(
    private _divisionsAdaptorsFactory: TimelineDivisionsAdaptorsManager,
    @Inject(ZOOMS) private _zooms: ITimelineZoom[],
  ) {
    this.zoom$ = this._zoomSubject.asObservable();
  }

  /**
   * Change zoom to one of the existed in zooms array
   */
  changeZoom(zoom: ITimelineZoom): void {
    if (!zoom || this.isZoomActive(zoom))
      return;

    this._zoomSubject.next(zoom);
  }

  /**
   * Change zoom to max value
   */
  zoomFullIn(): void {
    this.changeZoom(this._zooms[this._getMaxZoomIndex()]);
  }

  /**
   * Change zoom to min value
   */
  zoomFullOut(): void {
    this.changeZoom(this._zooms[this._getMinZoomIndex()]);
  }

  /**
   * Change zoom for 1 step in
   */
  zoomIn(): void {
    let newZoomIndex = this.zoom.index + 1;
    if (newZoomIndex > this._getMaxZoomIndex()) {
      newZoomIndex = this._getMaxZoomIndex();
    }

    this.changeZoom(this._zooms[newZoomIndex]);
  }

  /**
   * Change zoom for 1 step out
   */
  zoomOut(): void {
    let newZoomIndex = this.zoom.index - 1;
    if (newZoomIndex < this._getMinZoomIndex()) {
      newZoomIndex = this._getMinZoomIndex();
    }

    this.changeZoom(this._zooms[newZoomIndex]);
  }

  /**
   * Check is current zoom the same
   */
  isZoomActive(zoom: ITimelineZoom): boolean {
    return this.zoom.index === zoom.index;
  }

  /**
   * Automatically chooses most ... zoom and set camera to center of the items
   */
  fitToContent(paddings = 15): void {
    this._component.fitToContent(paddings);
  }

  /**
   * Set horizontal scroll to center of the date
   */
  attachCameraToDate(date: Date): void {
    this._component.attachCameraToDate(date);
  }

  /**
   * @hidden
   */
  _registerComponent(component: TimelineComponent): void {
    this._component = component;
  }

  /**
   * @hidden
   */
  _calculateOptimalZoom(startDate: Date, endDate: Date, visibleWidth: number, paddings = 15): ITimelineZoom {
    let zoom = this._zooms[this._getMinZoomIndex()];

    for (let i = this._getMaxZoomIndex(); i >= this._getMinZoomIndex(); i--) {
      const currentZoom = this._zooms[i];
      const divisionCalculator = this._divisionsAdaptorsFactory.getAdaptor(currentZoom.division);
      const countOfColumns = divisionCalculator.getUniqueDivisionsCountBetweenDates(startDate, endDate);

      if (countOfColumns * currentZoom.columnWidth < (visibleWidth - paddings * 2)) {
        zoom = currentZoom;
        break;
      }
    }

    return zoom;
  }

  private _getMaxZoomIndex(): number {
    return this._zooms.length - 1;
  }

  private _getMinZoomIndex(): number {
    return 0;
  }
}
