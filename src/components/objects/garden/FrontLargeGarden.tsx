import { Point } from '../../../utils/math/Point';
import { ArcSweep, PathArc } from '../types/Path';
import { Shape } from '../types/Shape';

export const feet = (feet: number) => feet * 12;

export class FrontLargeGardenMap extends Shape {
  constructor(offset: Point = [0, 0], fill: string = 'rgba(255,0,0,.6)', stroke = 'black') {
    super(
      offset,
      [
        PathArc.circular([feet(3.5), feet(0)], feet(2), ArcSweep.inward, 0, 1),
        PathArc.circular([feet(0), feet(8.1)], feet(14), ArcSweep.outward, 0, 0),
        PathArc.circular([feet(-3.5), feet(0)], feet(2), ArcSweep.inward, 0, 1),
        PathArc.circular([feet(0), feet(-8.1)], feet(14), ArcSweep.outward, 0, 0),
      ],
      {
        fill,
        stroke,
        rotation: -90,
      }
    );
  }
  getTypeId(): string {
    return 'garden:largeFront';
  }

  getVersion(): number {
    return 1;
  }
  isSelectable(): boolean {
    return true;
  }
  isMovable() {
    return true;
  }
}
