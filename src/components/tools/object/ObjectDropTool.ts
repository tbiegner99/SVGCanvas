import { RenderableObject } from '../../objects/RenderableObject';

import { DragState } from '../../../utils/DragState';

import { HandlerState, Tool } from '../Tool';

export class ObjectDropTool implements Tool<HandlerState> {
  private object;
  onObjectDrop: (r: RenderableObject) => void;
  constructor(object: RenderableObject, onObjectDrop: (r: RenderableObject) => void) {
    this.object = object;
    this.onObjectDrop = onObjectDrop;
  }
  onClick() {
    this.onObjectDrop(this.object);
  }
  onDragEnd(evt: DragEvent, dragState: DragState<HandlerState>) {}
  onDrag(evt: DragEvent, dragState: DragState<HandlerState>, onUpdateState: any) {
    return dragState.target;
  }
  onDragStart(evt: MouseEvent, dragState: DragState<HandlerState>): HandlerState {
    return dragState.target;
  }
  canBeOverridden() {
    return false;
  }
}
