import { ShortcutHandler } from '../ShortcutHandler';
import { ShortcutMatcher } from '../ShortcutMatcher';
import { CanvasState } from '../../../components/CanvasState';
import { MoveCanvasTool } from '../../tools/canvas/MoveCanvasTool';

import { VectorUtils } from '../../../utils/MathFunctions';
import { Point } from '../../../utils/math/Point';

export class MoveHandler implements ShortcutHandler {
  private key: string;
  private movement: Point;
  constructor(key: string, movement: Point) {
    this.key = key;
    this.movement = movement;
  }
  shouldShortCircuit(): boolean {
    return true;
  }
  getMatcher(): ShortcutMatcher {
    return ShortcutMatcher.fromString(this.key);
  }
  process(evt: KeyboardEvent, canvasState: CanvasState): CanvasState {
    evt.preventDefault();
    canvasState.selectedObjectIndicies.forEach((index) => {
      canvasState.objects[index].move(
        VectorUtils.scalarMultiply(this.movement, canvasState.options.snap)
      );
    });

    return {
      ...canvasState,
      currentTool: new MoveCanvasTool(),
      objects: [...canvasState.objects],
      createObject: undefined,
    };
  }
}
export class MoveUpHandler extends MoveHandler {
  constructor() {
    super('ARROWUP', [0, -1]);
  }
}

export class MoveDownHandler extends MoveHandler {
  constructor() {
    super('ARROWDOWN', [0, 1]);
  }
}

export class MoveLeftHandler extends MoveHandler {
  constructor() {
    super('ARROWLEFT', [-1, 0]);
  }
}

export class MoveRightHandler extends MoveHandler {
  constructor() {
    super('ARROWRIGHT', [1, 0]);
  }
}
