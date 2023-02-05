import { Point } from '../../../utils/math/Point';
import { RenderableRectangle } from '../types/Rectangle';

export const feet = (feet: number) => feet * 12;

export class HerbsGardenMap extends RenderableRectangle {
  constructor(offset: Point = [0, 0], fill: string = 'rgba(255,0,0,.6)', stroke = 'black') {
    super([feet(7), feet(2.5)], offset, { fill, stroke, rotation: 0 });
  }
  getTypeId(): string {
    return 'garden:herbs';
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
