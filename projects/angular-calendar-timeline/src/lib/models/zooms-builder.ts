import { Observable } from "rxjs";
import { ITimelineZoom, TimelineViewMode } from "./zoom";

export interface IIndexedZoom<ViewMode = TimelineViewMode> extends ITimelineZoom<ViewMode> {
  index: number;
}

export interface IZoomsHandler<ViewMode> {
  activeZoom$: Observable<IIndexedZoom<ViewMode>>;

  readonly activeZoom: IIndexedZoom<ViewMode>;

  readonly zooms: IIndexedZoom<ViewMode>[];

  setZooms(zooms: ITimelineZoom<ViewMode>[]): void;

  getFirstZoom(): IIndexedZoom<ViewMode>;

  getLastZoom(): IIndexedZoom<ViewMode>;

  zoomIn(): void;

  zoomOut(): void;

  changeActiveZoom(zoom: ITimelineZoom<ViewMode>): void;

  isZoomActive(zoom: ITimelineZoom<ViewMode>): boolean;
}
