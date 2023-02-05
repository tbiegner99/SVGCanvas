import { ShortcutHandler } from '../ShortcutHandler';
import { ShortcutMatcher } from '../ShortcutMatcher';
import { CanvasState } from '../../../components/CanvasState';

export class ZoomInHandler implements ShortcutHandler {
  shouldShortCircuit(): boolean {
    return true;
  }
  getMatcher(): ShortcutMatcher {
    return ShortcutMatcher.fromString('CTRL+=');
  }
  process(evt: KeyboardEvent, canvasState: CanvasState): CanvasState {
    evt.preventDefault();
    const newZoom = Math.max(1, canvasState.zoom * 1.1);
    return {
      ...canvasState,
      zoom: newZoom,
      viewport: canvasState.viewport.zoom(newZoom),
    };
  }
}

export class ZoomOutHandler implements ShortcutHandler {
  shouldShortCircuit(): boolean {
    return true;
  }
  getMatcher(): ShortcutMatcher {
    return ShortcutMatcher.fromString('CTRL+-');
  }
  process(evt: KeyboardEvent, canvasState: CanvasState): CanvasState {
    evt.preventDefault();
    const newZoom = Math.max(1, canvasState.zoom / 1.1);
    return {
      ...canvasState,
      zoom: newZoom,
      viewport: canvasState.viewport.zoom(newZoom),
    };
  }
}
