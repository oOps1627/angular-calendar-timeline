import { IIdObject } from "./id-object";

export interface ITimelineItem<Meta = any> extends IIdObject {
  /**
   * Name of item. Needs only for view.
   */
  name: string;

  /**
   * Date when item starts. If 'streamItems' property is not empty then 'startDate' will be cleared.
   */
  startDate?: Date;

  /**
   * Date when item ends. If 'streamItems' property is not empty then 'endDate' will be cleared.
   */
  endDate?: Date;

  /**
   * Allows to disable / enable resize to left
   */
  canResizeLeft?: boolean;

  /**
   * Allows to disable / enable resize to right
   */
  canResizeRight?: boolean;

  /**
   * Disable / enable vertical item dragging
   */
  canDragY?: boolean;

  /**
   * Disable / enable horizontal item dragging
   */
  canDragX?: boolean;

  /**
   * These items will be determined like children and will be displayed under the current item in separate rows.
   */
  childrenItems?: ITimelineItem<Meta>[];

  /**
   * Transforms current item into the stream. It allows adding multiple items into one row.
   * Can't be used simultaneously with the startDate/endDate of the current item.
   * Also these items can't contain childrenItems.
   */
  streamItems?: (Omit<ITimelineItem<Meta>, 'childrenItems'>)[];

  /**
   * Show / hide inner items. Can toggle in left panel. Works only if item has not empty array in "innerItems" property.
   */
  childrenItemsExpanded?: boolean;

  /**
   * Here can be added some custom data about item. It not uses in the library.
   */
  meta?: Meta;

  /**
   * Trigger Change Detection in component created for this item.
   */
  updateView?(): void;

  _width?: number;

  _left?: number;

  _streamLevels?: ITimelineItem[][];
}
