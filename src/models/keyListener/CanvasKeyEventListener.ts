import { ShortcutHandler } from './ShortcutHandler';
import { CanvasState } from '../../components/CanvasState';
export class CanvasKeyListener {
  private handlers: ShortcutHandler[];
  private _events: any;
  private state: CanvasState;
  private onUpdateState: any;
  constructor(handlers: ShortcutHandler[], state: CanvasState, onUpdateState: any) {
    this.handlers = handlers;
    this.state = state;
    this._events = {
      onKeyDown: this.onKeyDown.bind(this),
    };
    this.onUpdateState = onUpdateState;
  }
  get events(): any {
    return this._events;
  }
  onKeyDown(evt: KeyboardEvent) {
    var newState = this.state;
    var shouldUpdate = false;
    for (var h of this.handlers) {
      if (h.getMatcher().matches(evt)) {
        newState = h.process(evt, newState);
        shouldUpdate = true;
        if (h.shouldShortCircuit()) {
          break;
        }
      }
    }
    if (shouldUpdate) {
      this.onUpdateState(newState);
    }
  }
}
