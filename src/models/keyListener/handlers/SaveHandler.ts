import { ShortcutHandler } from '../ShortcutHandler';
import { ShortcutMatcher } from '../ShortcutMatcher';
import { CanvasState } from '../../../components/CanvasState';
import { RootSerializer } from 'models/serialization/RenderableObjectSerializer';

export class SaveHandler implements ShortcutHandler {
  onSave: (obj: any[]) => any;
  serializer: RootSerializer;
  constructor(onSave: (obj: any[]) => any, serializer: RootSerializer) {
    this.onSave = onSave;
    this.serializer = serializer;
  }
  shouldShortCircuit(): boolean {
    return true;
  }
  getMatcher(): ShortcutMatcher {
    return ShortcutMatcher.fromString('CTRL+S');
  }
  process(evt: KeyboardEvent, canvasState: CanvasState): CanvasState {
    evt.preventDefault();
    this.onSave(canvasState.objects.map((obj) => this.serializer.serialize(obj)));
    return canvasState;
  }
}
