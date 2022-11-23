import { Inject, Injectable } from "@angular/core";
import {
  DIVISIONS_CALCULATOR_FACTORY,
  TimelineDivisionsCalculatorFactory
} from "./divisions-calculator/divisions-calculator-factory";
import { ZOOMS } from "./zooms";
import { ITimelineZoom } from "./models";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable()
export class ZoomService {
  zoom$: Observable<ITimelineZoom>;
  _fitToContent$ = new Subject<{ paddings: number }>();

  private _zoomSubject = new BehaviorSubject<ITimelineZoom>(this._zooms[this._getMaxZoomIndex()]);

  get zoom(): ITimelineZoom {
    return this._zoomSubject.value;
  }

  constructor(
    @Inject(DIVISIONS_CALCULATOR_FACTORY) private _divisionsCalculatorFactory: TimelineDivisionsCalculatorFactory,
    @Inject(ZOOMS) private _zooms: ITimelineZoom[]
  ) {
    this.zoom$ = this._zoomSubject.asObservable();
  }

  changeZoom(zoom: ITimelineZoom): void {
    if (!zoom || this.isZoomActive(zoom))
      return;

    this._zoomSubject.next(zoom);
  }

  zoomFullIn(): void {
    this.changeZoom(this._zooms[this._getMaxZoomIndex()]);
  }

  zoomFullOut(): void {
    this.changeZoom(this._zooms[this._getMinZoomIndex()]);
  }

  zoomIn(): void {
    let newZoomIndex = this.zoom.index + 1;
    if (newZoomIndex > this._getMaxZoomIndex()) {
      newZoomIndex = this._getMaxZoomIndex();
    }

    this.changeZoom(this._zooms[newZoomIndex]);
  }

  zoomOut(): void {
    let newZoomIndex = this.zoom.index - 1;
    if (newZoomIndex < this._getMinZoomIndex()) {
      newZoomIndex = this._getMinZoomIndex();
    }

    this.changeZoom(this._zooms[newZoomIndex]);
  }

  isZoomActive(zoom: ITimelineZoom): boolean {
    return this.zoom.index === zoom.index;
  }

  fitToContent(paddings = 15): void {
    this._fitToContent$.next({paddings});
  }

  _calculateOptimalZoom(startDate: Date, endDate: Date, visibleWidth: number, paddings = 15): ITimelineZoom {
    let zoom = this._zooms[this._getMinZoomIndex()];

    for (let i = this._getMaxZoomIndex(); i >= this._getMinZoomIndex(); i--) {
      const currentZoom = this._zooms[i];
      const divisionCalculator = this._divisionsCalculatorFactory.getDivisionCalculator(currentZoom.division);
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
