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
   * Change zoom to one of the existing zooms
   */
  changeZoom(zoom: ITimelineZoom): void {
    if (!zoom || this.isZoomActive(zoom))
      return;

    this._zoomSubject.next(zoom);
  }

  /**
   * Changes zoom to the max value
   */
  zoomFullIn(): void {
    this.changeZoom(this._zooms[this._getMaxZoomIndex()]);
  }

  /**
   * Changes zoom to the min value
   */
  zoomFullOut(): void {
    this.changeZoom(this._zooms[this._getMinZoomIndex()]);
  }

  /**
   * Changes zoom for 1 step back
   */
  zoomIn(): void {
    let newZoomIndex = this.zoom.index + 1;
    if (newZoomIndex > this._getMaxZoomIndex()) {
      newZoomIndex = this._getMaxZoomIndex();
    }

    this.changeZoom(this._zooms[newZoomIndex]);
  }

  /**
   * Changes zoom for 1 step forward
   */
  zoomOut(): void {
    let newZoomIndex = this.zoom.index - 1;
    if (newZoomIndex < this._getMinZoomIndex()) {
      newZoomIndex = this._getMinZoomIndex();
    }

    this.changeZoom(this._zooms[newZoomIndex]);
  }

  /**
   * Checks if current zoom is the same
   */
  isZoomActive(zoom: ITimelineZoom): boolean {
    return this.zoom.index === zoom.index;
  }

  /**
   * Automatically chooses the most optimal zoom and sets the camera to the center of the items
   */
  fitToContent(paddings = 15): void {
    this._component.fitToContent(paddings);
  }

  /**
   * Sets horizontal scroll to the center of the date
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
