import { Point } from '../../../utils/math/Point';
import { PathLine } from '../types/Path';
import { Shape } from '../types/Shape';

export const feet = (feet: number) => feet * 12;

export class SideGardenMap extends Shape {
  constructor(offset: Point = [0, 0], fill: string = 'rgba(255,0,0,.6)', stroke = 'black') {
    super(
      offset,
      [
        PathLine.horizontal(feet(6)),
        PathLine.vertical(feet(3)),
        PathLine.horizontal(feet(-3)),
        PathLine.vertical(feet(18)),
        PathLine.horizontal(feet(6)),
        PathLine.vertical(feet(-6)),
        PathLine.horizontal(feet(2.5)),
        PathLine.vertical(feet(9)),
        PathLine.horizontal(feet(-11.5)),
        PathLine.vertical(feet(-24)),
      ],
      { fill, stroke, rotation: 0 }
    );
  }
  getTypeId(): string {
    return 'garden:side';
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
