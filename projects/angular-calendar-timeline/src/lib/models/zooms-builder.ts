import { Observable } from "rxjs";
import { ITimelineZoom } from "./zoom";

export interface IIndexedZoom extends ITimelineZoom {
  index: number;
}

export interface IZoomsHandler {
  activeZoom$: Observable<IIndexedZoom>;

  readonly activeZoom: IIndexedZoom;

  readonly zooms: IIndexedZoom[];

  setZooms(zooms: ITimelineZoom[]): void;

  getFirstZoom(): IIndexedZoom;

  getLastZoom(): IIndexedZoom;

  zoomIn(): void;

  zoomOut(): void;

  changeActiveZoom(zoom: ITimelineZoom): void;

  isZoomActive(zoom: ITimelineZoom): boolean;
}
