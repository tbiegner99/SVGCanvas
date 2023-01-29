import { Point } from '../Point';
import type { Rectangle } from './Rectangle';
export interface Geometry {
  get boundingRect(): Rectangle;
  get center(): Point;
}
