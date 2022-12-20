import { IIdObject } from "./id-object";

export interface ITimelineItem<Meta = any> extends IIdObject {
  /**
   * Name of item. Needs only for view.
   */
  name: string;

  /**
   * Date when item starts.
   */
  startDate: Date;

  /**
   * Date when item ends.
   */
  endDate: Date;

  /**
   * Allows to disable / enable resize to left
   */
  canResizeLeft: boolean;

  /**
   * Allows to disable / enable resize to right
   */
  canResizeRight: boolean;

  /**
   * Disable / enable item dragging
   */
  canDrag: boolean;

  /**
   * Each item can contains own items.
   */
  items?: ITimelineItem<Meta>[];

  /**
   * Show / hide inner items. Can toggle in left panel. Works only if item has not empty array in "items" property.
   */
  expanded?: boolean;

  /**
   * Here can be added some custom information about item.
   */
  meta?: Meta;

  /**
   * Trigger Change Detection in component created for this item.
   */
  updateView?(): void;

  _width?: number;

  _left?: number;
}
