import { Point } from '../../../utils/math/Point';
import { ArcSweep, PathArc, PathLine } from '../types/Path';
import { Shape } from '../types/Shape';

export const feet = (feet: number) => feet * 12;

export class StrawberriesGardenMap extends Shape {
  constructor(offset: Point = [0, 0], fill: string = 'rgba(255,0,0,.6)', stroke = 'black') {
    super(
      offset,
      [
        PathLine.horizontal(24),
        PathLine.vertical(feet(6.5)),
        PathLine.horizontal(-30),
        new PathLine(6, -41),
        PathLine.vertical(-37),
      ],
      { fill, stroke, rotation: 0 }
    );
  }
  isSelectable(): boolean {
    return true;
  }
  isMovable() {
    return true;
  }
}
