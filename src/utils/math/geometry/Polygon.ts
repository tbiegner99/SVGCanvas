import { BBox, Geometry, Position } from '@turf/turf';
import { Point } from '../Point';
import { Rectangle } from './Rectangle';
import GraphicsUtils from '../GraphicsUtils';
import { polygon, intersect } from '@turf/turf';
import VectorUtils from '../VectorUtils';

export class Polygon implements Geometry {
  private _points: Array<Point>;
  constructor(points: Array<Point>) {
    this._points = points;
  }
  coordinates: Position | Position[] | Position[][] | Position[][][];
  type: string;
  bbox?: BBox | undefined;

  get points(): Array<Point> {
    return this._points;
  }

  get boundingRect(): Rectangle {
    return Rectangle.getBoundingRect(...this._points);
  }
  rotate(angle: number, origin = [0, 0] as Point): Polygon {
    return new Polygon(
      this._points.map((point: Point) => GraphicsUtils.rotatePoint2D(point, angle, origin))
    );
  }

  get center(): Point {
    return VectorUtils.average(...this._points);
  }

  intersects(shape: Polygon): boolean {
    const poly1 = polygon([this.points]);
    const poly2 = polygon([shape.points]);
    return intersect(poly1, poly2) != null;
  }
}
