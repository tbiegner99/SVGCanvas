import React from 'react';
import { Circle } from '../../../utils/math/geometry/Circle';
import { Rectangle } from '../../../utils/math/geometry/Rectangle';
import { Point } from '../../../utils/math/Point';
import { Tool } from '../../../models/tools/Tool';
import { RenderableObject } from '../RenderableObject';
import { AbstractRenderableObject, RenderObjectOptions } from './AbstractRenderableObject';
export class RenderableCircle extends AbstractRenderableObject implements RenderableObject {
  private circle: Circle;

  constructor(radius: number, offset: Point, options: RenderObjectOptions = {}) {
    super(offset, options);
    this.circle = new Circle(radius);
  }

  get radius() {
    return this.circle.radius;
  }

  getTypeId(): string {
    return 'builtin:circle';
  }

  getVersion(): number {
    return 1;
  }

  isSelectable(): boolean {
    return true;
  }
  isMovable(): boolean {
    return true;
  }

  computeBoundingRect(): Rectangle {
    const rect = Rectangle.createFromPoints(
      [0, 0],
      [2 * this.circle.radius, 2 * this.circle.radius]
    );
    return rect;
  }

  render(): JSX.Element {
    return (
      <g>
        <circle
          r={this.circle.radius}
          cx={this.circle.radius}
          cy={this.circle.radius}
          strokeWidth={0.1}
          stroke={this.stroke}
          fill={this.fill}
        />
      </g>
    );
  }
  canApplyTool(tool: Tool<any>): boolean {
    return true;
  }
}
