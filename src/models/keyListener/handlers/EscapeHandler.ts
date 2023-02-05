import { ShortcutHandler } from '../ShortcutHandler';
import { ShortcutMatcher } from '../ShortcutMatcher';
import { CanvasState } from '../../../components/CanvasState';
import { MoveCanvasTool } from '../../tools/canvas/MoveCanvasTool';
export class EscapeHandler implements ShortcutHandler {
  shouldShortCircuit(): boolean {
    return true;
  }
  getMatcher(): ShortcutMatcher {
    return ShortcutMatcher.fromString('ESCAPE');
  }
  process(evt: KeyboardEvent, canvasState: CanvasState): CanvasState {
    return {
      ...canvasState,
      currentTool: new MoveCanvasTool(),
      createObject: undefined,
      selectedObjectIndicies: [],
    };
  }
}
