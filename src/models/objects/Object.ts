import { Polygon } from '../../utils/math/geometry/Geometry';
import { Serializable } from '../Serializable';

export abstract class CanvasObject extends Polygon implements Serializable {
  abstract toJSON(): object;
}
