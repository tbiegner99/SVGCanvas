import { ShortcutHandler } from '../ShortcutHandler';
import { ShortcutMatcher } from '../ShortcutMatcher';
import { CanvasState } from '../../../components/CanvasState';
import { MoveCanvasTool } from '../../tools/canvas/MoveCanvasTool';
export class DeleteHandler implements ShortcutHandler {
  shouldShortCircuit(): boolean {
    return true;
  }
  getMatcher(): ShortcutMatcher {
    return ShortcutMatcher.fromString('DELETE');
  }
  process(evt: KeyboardEvent, canvasState: CanvasState): CanvasState {
    const newObjects = canvasState.objects.filter(
      (item, index) => !canvasState.selectedObjectIndicies.includes(index)
    );
    return {
      ...canvasState,
      currentTool: new MoveCanvasTool(),
      objects: newObjects,
      selectedObjectIndicies: [],
      createObject: undefined,
    };
  }
}
