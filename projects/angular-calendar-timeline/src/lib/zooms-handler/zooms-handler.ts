import { BehaviorSubject, Observable } from "rxjs";
import { ITimelineZoom, TimelineViewMode } from "../models/zoom";
import { IIndexedZoom, IZoomsHandler } from "../models";

export class ZoomsHandler<ViewMode = TimelineViewMode> implements IZoomsHandler<ViewMode> {
  private _zooms: IIndexedZoom<ViewMode>[];
  private _activeZoom$ = new BehaviorSubject<IIndexedZoom<ViewMode>>(null);

  activeZoom$: Observable<IIndexedZoom<ViewMode>> = this._activeZoom$.asObservable();

  get activeZoom(): IIndexedZoom<ViewMode> {
    return this._activeZoom$.value;
  }

  get zooms(): IIndexedZoom<ViewMode>[] {
    return this._zooms;
  }

  constructor(zooms: ITimelineZoom<ViewMode>[]) {
    this.setZooms(zooms);
  }

  setZooms(zooms: ITimelineZoom<ViewMode>[]): void {
    this._zooms = (zooms ?? []).map((item, index) => ({...item, index}));
    this._activeZoom$.next(this.getLastZoom());
  }

  getFirstZoom(): IIndexedZoom<ViewMode> {
    return this._zooms[0];
  }

  getLastZoom(): IIndexedZoom<ViewMode> {
    return this._zooms[this._zooms.length - 1];
  }

  zoomIn(): void {
    let newZoomIndex = this.activeZoom.index + 1;
    const lastZoomIndex = this.getLastZoom().index;
    if (newZoomIndex > lastZoomIndex) {
      newZoomIndex = lastZoomIndex;
    }

    this.changeActiveZoom(this._zooms[newZoomIndex]);
  }

  zoomOut(): void {
    let newZoomIndex = this.activeZoom.index - 1;
    const firstZoomIndex = this.getFirstZoom().index;
    if (newZoomIndex < firstZoomIndex) {
      newZoomIndex = firstZoomIndex;
    }

    this.changeActiveZoom(this._zooms[newZoomIndex]);
  }

  changeActiveZoom(zoom: ITimelineZoom<ViewMode>): void {
    if (zoom) {
      this._activeZoom$.next(this._zooms[this._findZoomIndex(zoom)]);
    }
  }

  isZoomActive(zoom: ITimelineZoom<ViewMode>): boolean {
    return this._findZoomIndex(zoom) === this.activeZoom.index;
  }

  private _findZoomIndex(zoom: ITimelineZoom<ViewMode>): number {
    return this._zooms.findIndex(i => i.columnWidth === zoom.columnWidth && i.viewMode === zoom.viewMode);
  }
}
