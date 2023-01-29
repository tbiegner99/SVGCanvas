import { Dimension } from '../Dimension';
import { Polygon } from './Polygon';
import { Point } from '../Point';
import Vector from '../VectorUtils';

export class Rectangle extends Polygon implements Shape {
  private _topLeft: Point;
  private _topRight: Point;
  private _bottomLeft: Point;
  private _bottomRight: Point;
  private _topCenter: Point;
  private _bottomCenter: Point;
  private _leftCenter: Point;
  private _rightCenter: Point;
  private _center: Point;
  private _size: Dimension;
  constructor(location: Point, size: Dimension) {
    let points: [Point, Point, Point, Point] = [
      location,
      Vector.add(location, [size[0], 0]),
      Vector.add(location, [size[0], size[1]]),
      Vector.add(location, [0, size[1]]),
    ];
    /* ensure rectangle has positive dimension */
    /* negitive size means the location is not the top left point
        so we ensure the location is the top left */
    location = Vector.min(...points) as Point;
    points = [
      location,
      Vector.add(location, [size[0], 0]),
      Vector.add(location, [size[0], size[1]]),
      Vector.add(location, [0, size[1]]),
    ];
    super(points);
    this._size = Vector.abs(size);
    this._topLeft = points[0];
    this._topRight = points[1];
    this._bottomLeft = points[3];
    this._bottomRight = points[2];

    this._center = Vector.average(this.topLeft, this.bottomRight);
    this._topCenter = Vector.add(this._center, [0, -size[1] / 2]);
    this._bottomCenter = Vector.add(this._center, [0, size[1] / 2]);
    this._rightCenter = Vector.add(this._center, [size[0] / 2, 0]);
    this._leftCenter = Vector.add(this._center, [-size[0] / 2, 0]);
  }

  static createFromPoints(point1: Point, point2: Point): Rectangle {
    const dimension: Dimension = Vector.subtract(point2, point1);
    return new Rectangle(point1, dimension);
  }

  static getBoundingRect(...points: Point[]): Rectangle {
    const min: Point = Vector.min(...points);
    const max: Point = Vector.max(...points);
    return Rectangle.createFromPoints(min, max);
  }

  get location(): Point {
    return this._topLeft;
  }

  get size(): Dimension {
    return this._size;
  }

  get topLeft(): Point {
    return this._topLeft;
  }

  get topRight(): Point {
    return this._topRight;
  }

  get bottomRight(): Point {
    return this._bottomRight;
  }
  get bottomLeft(): Point {
    return this._bottomLeft;
  }
  get center(): Point {
    return this._center;
  }

  get topCenter(): Point {
    return this._topCenter;
  }
  get bottomCenter(): Point {
    return this._bottomCenter;
  }
  get leftCenter(): Point {
    return this._leftCenter;
  }
  get rightCenter(): Point {
    return this._rightCenter;
  }

  getArea(): number {
    return this.size[0] * this.size[1];
  }

  overlaps(rect: Rectangle) {
    if (this.topLeft[0] > rect.bottomRight[0] || rect.topLeft[0] > this.bottomRight[0]) {
      return false;
    }
    if (this.bottomRight[1] < rect.topLeft[1] || rect.bottomRight[1] < this.topLeft[1]) {
      return false;
    }
    return true;
  }
}
