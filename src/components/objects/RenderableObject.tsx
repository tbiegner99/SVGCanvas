import { Rectangle } from '../../utils/math/geometry/Rectangle';
import { Point } from '../../utils/math/Point';
import { Tool } from '../../models/tools/Tool';

export interface RenderableObjectFactory {
  getRenderObject(location: Point): RenderableObject;
  canDropObjectOn(object?: RenderableObject): boolean;
  canCreateObject(object?: RenderableObject): boolean;
  onObjectCreated: (objectsCreated: number) => any;
}

export interface RenderOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface RenderableObject {
  rotation?: number;
  zIndex?: number;
  getTypeId(): string;
  getVersion(): number;
  render(): JSX.Element;
  getId(): string;
  move(point: Point): void;
  getLocation(): Point;
  getRenderOptions(): RenderOptions;

  getBoundingRectangle(): Rectangle;
  isMovable(): boolean;
  isSelectable(): boolean;
  canApplyTool(tool: Tool<any>): boolean;
}
