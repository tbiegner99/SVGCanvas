import { ShortcutMatcher } from './ShortcutMatcher';
import { CanvasState } from '../../components/CanvasState';
export interface ShortcutHandler {
  shouldShortCircuit(): boolean;
  getMatcher(): ShortcutMatcher;
  process(evt: KeyboardEvent, canvasState: CanvasState): CanvasState;
}
