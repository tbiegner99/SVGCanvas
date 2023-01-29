import { Dimension } from './Dimension';
import { Point } from './Point';
import { Rectangle } from './geometry/Rectangle';
import VectorUtils from './VectorUtils';

export default class GraphicsUtils {
  static degreesToRadians(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  static rectangleFrom2Points(pt1: Point, pt2: Point): Rectangle {
    if (!pt2) {
      pt2 = pt1;
      pt1 = [0, 0];
    }
    const maxPoint = VectorUtils.max(pt1, pt2);
    const minPoint = VectorUtils.min(pt1, pt2);
    const size: Dimension = VectorUtils.subtract(maxPoint, minPoint) as Dimension;
    return new Rectangle(minPoint, size);
  }

  static rotatePoint2D(point: Point, theta: number, origin = [0, 0]): Point {
    const cartesianRelativePoint = VectorUtils.subtract(point, origin);
    const angle = GraphicsUtils.degreesToRadians(theta);
    return [
      origin[0] +
        cartesianRelativePoint[0] * Math.cos(angle) -
        cartesianRelativePoint[1] * Math.sin(angle),
      origin[1] +
        cartesianRelativePoint[0] * Math.sin(angle) +
        cartesianRelativePoint[1] * Math.cos(angle),
    ];
  }
}
