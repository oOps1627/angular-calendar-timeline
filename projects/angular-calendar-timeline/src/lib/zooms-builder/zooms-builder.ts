import { BehaviorSubject, Observable } from "rxjs";
import { ITimelineZoom } from "../models/zoom";
import { IZoomsBuilder } from "../models";

interface IIndexedZoom extends ITimelineZoom {
  index: number;
}

export class ZoomsBuilder implements IZoomsBuilder {
  private _zooms: IIndexedZoom[];
  private _activeZoom$ = new BehaviorSubject<IIndexedZoom>(null);

  activeZoom$: Observable<IIndexedZoom> = this._activeZoom$.asObservable();

  get activeZoom(): IIndexedZoom {
    return this._activeZoom$.value;
  }

  get zooms(): IIndexedZoom[] {
    return this._zooms;
  }

  constructor(zooms: ITimelineZoom[]) {
    this.setZooms(zooms);
  }

  setZooms(zooms: ITimelineZoom[]): void {
    this._zooms = (zooms ?? []).map((item, index) => ({...item, index}));
    this._activeZoom$.next(this.getLastZoom());
  }

  getFirstZoom(): IIndexedZoom {
    return this._zooms[0];
  }

  getLastZoom(): IIndexedZoom {
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

  changeActiveZoom(zoom: ITimelineZoom): void {
    if (zoom) {
      this._activeZoom$.next(this._zooms[this._findZoomIndex(zoom)]);
    }
  }

  isZoomActive(zoom: ITimelineZoom): boolean {
    return this._findZoomIndex(zoom) === this.activeZoom.index;
  }

  private _findZoomIndex(zoom: ITimelineZoom): number {
    return this._zooms.findIndex(i => i.columnWidth === zoom.columnWidth && i.division === zoom.division);
  }
}
