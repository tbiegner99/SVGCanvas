import { Point } from '../Point';
import { Geometry } from './Geometry';
import { Rectangle } from './Rectangle';

export class Circle implements Geometry {
  private _center: Point;
  private _radius: number;

  constructor(_radius: number, _center: Point = [0, 0]) {
    this._center = _center;
    this._radius = _radius;
  }

  get center(): Point {
    return this._center;
  }

  get radius(): number {
    return this._radius;
  }

  get boundingRect() {
    return new Rectangle(
      [this.center[0] - this._radius, this._center[1] - this.radius],
      [2 * this._radius, 2 * this._radius]
    );
  }
}
