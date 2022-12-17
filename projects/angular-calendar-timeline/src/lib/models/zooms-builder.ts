import { Observable } from "rxjs";
import { ITimelineZoom } from "./zoom";

export interface IZoomsBuilder {
  activeZoom$: Observable<ITimelineZoom>;

  readonly activeZoom: ITimelineZoom;

  readonly zooms: ITimelineZoom[];

  setZooms(zooms: ITimelineZoom[]): void;

  getFirstZoom(): ITimelineZoom;

  getLastZoom(): ITimelineZoom;

  zoomIn(): void;

  zoomOut(): void;

  changeActiveZoom(zoom: ITimelineZoom): void;

  isZoomActive(zoom: ITimelineZoom): boolean;
}
