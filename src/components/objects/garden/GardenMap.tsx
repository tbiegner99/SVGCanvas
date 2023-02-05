import { Point } from '../../../utils/math/Point';
import { ArcSweep, PathArc, PathLine } from '../types/Path';
import { Shape } from '../types/Shape';

export const feet = (feet: number) => feet * 12;

export class GardenMap extends Shape {
  constructor(offset: Point = [0, 0], fill: string = 'rgba(255,0,0,.6)', stroke = 'black') {
    super(
      offset,
      [
        PathLine.horizontal(feet(29)),
        PathLine.vertical(feet(2)),
        PathArc.circular([feet(-1), feet(1)], feet(1), ArcSweep.inward),
        PathLine.horizontal(feet(-6)),
        PathArc.circular([feet(-1), feet(1)], feet(1), ArcSweep.outward),
        PathLine.vertical(feet(10)),
        PathLine.horizontal(feet(-2)),
        PathLine.vertical(feet(-10)),
        PathArc.circular([feet(-1), feet(-1)], feet(1), ArcSweep.outward),
        PathLine.horizontal(feet(-17)),
        PathArc.circular([feet(-1), feet(-1)], feet(1), ArcSweep.inward),
      ],
      { fill, stroke, rotation: -90 }
    );
  }
  getTypeId(): string {
    return 'garden:gardenSide';
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
