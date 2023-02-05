import { Point } from '../../../utils/math/Point';
import { RenderableCircle } from '../types/Circle';

export const feet = (feet: number) => feet * 12;

export class FrontSmallGardenMap extends RenderableCircle {
  constructor(offset: Point = [0, 0], fill: string = 'rgba(255,0,0,.6)', stroke = 'black') {
    super(feet(2), offset, { fill, stroke, rotation: 0 });
  }

  getTypeId(): string {
    return 'garden:smallFront';
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
