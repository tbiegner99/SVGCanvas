import { Point } from '../../../utils/math/Point';
import { RenderOptions, RenderableObject } from '../RenderableObject';
import { Rectangle } from '../../../utils/math/geometry/Rectangle';
import { v4 } from 'uuid';
import VectorUtils from '../../../utils/math/VectorUtils';
import { Tool } from '../../../models/tools/Tool';

export interface RenderObjectOptions {
  zIndex?: number;
  fill?: string;
  stroke?: string;
  start?: Point;
  strokeWidth?: number;
  baseRotation?: number;
  rotation?: number;
}
export abstract class AbstractRenderableObject implements RenderableObject {
  protected offset: Point;
  protected fill: string | undefined;
  protected stroke: any;
  protected id: string;
  protected strokeWidth: number;
  zIndex: number;
  rotation: number;
  boundingRect: Rectangle;
  relativeBoundingRect: Rectangle;
  constructor(offset: Point, options: RenderObjectOptions = {}) {
    const {
      fill = 'rgba(0,0,0,0)',
      stroke = 'black',
      zIndex = 0,
      rotation = 0,
      strokeWidth = 0.1,
    } = options;
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.id = v4();
    this.zIndex = zIndex;
    this.rotation = rotation;

    this.offset = offset;
  }

  getRenderOptions(): RenderOptions {
    return {
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      fill: this.fill,
    };
  }

  isSelectable(): boolean {
    return true;
  }
  isMovable(): boolean {
    return true;
  }
  abstract render(): JSX.Element;
  getId(): string {
    return this.id;
  }
  move(point: Point): void {
    this.offset = VectorUtils.add(point, this.offset);
    this.boundingRect = this.computeBoundingRect(this.offset, this.rotation);
  }
  getLocation(): Point {
    return this.offset;
  }
  getBoundingRectangle(): Rectangle {
    if (!this.boundingRect) {
      this.boundingRect = this.computeBoundingRect(this.offset, this.rotation);
    }
    return this.boundingRect;
  }

  abstract computeBoundingRect(offset: Point, rotation: number): Rectangle;
  abstract canApplyTool(tool: Tool<any>): boolean;

  abstract getTypeId(): string;
  abstract getVersion(): number;
}
