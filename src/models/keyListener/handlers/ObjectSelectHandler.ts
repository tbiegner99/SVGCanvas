import { ShortcutHandler } from '../ShortcutHandler';
import { ShortcutMatcher } from '../ShortcutMatcher';
import { CanvasState } from '../../../components/CanvasState';

export class ObjectSelectHandler implements ShortcutHandler {
  shouldShortCircuit(): boolean {
    return true;
  }
  getMatcher(): ShortcutMatcher {
    return ShortcutMatcher.fromString('TAB');
  }
  process(evt: KeyboardEvent, canvasState: CanvasState): CanvasState {
    evt.preventDefault();
    if (canvasState.objects.length === 0) {
      return canvasState;
    }
    var newSelectedObjects = canvasState.selectedObjectIndicies;
    if (canvasState.selectedObjectIndicies.length !== 1) {
      newSelectedObjects = [-1];
    }
    for (var i = 0; i < canvasState.objects.length; i++) {
      var index = (newSelectedObjects[0] + i + 1) % canvasState.objects.length;

      if (canvasState.objects[index].isSelectable()) {
        newSelectedObjects = [index];
        break;
      }
    }
    return {
      ...canvasState,
      selectedObjectIndicies: newSelectedObjects,
    };
  }
}

export class MultipleObjectSelectHandler implements ShortcutHandler {
  shouldShortCircuit(): boolean {
    return true;
  }
  getMatcher(): ShortcutMatcher {
    return ShortcutMatcher.fromString('SHIFT+TAB');
  }
  process(evt: KeyboardEvent, canvasState: CanvasState): CanvasState {
    evt.preventDefault();
    if (canvasState.objects.length === 0) {
      return canvasState;
    }
    var newSelectedObjects = canvasState.selectedObjectIndicies;
    var selected = new Set(canvasState.selectedObjectIndicies);
    for (var i = 0; i < canvasState.objects.length; i++) {
      if (!selected.has(i) && canvasState.objects[i].isSelectable()) {
        newSelectedObjects.push(i);
        break;
      }
    }
    return {
      ...canvasState,
      selectedObjectIndicies: newSelectedObjects,
    };
  }
}
