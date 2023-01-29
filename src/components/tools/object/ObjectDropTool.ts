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

  canBeOverridden() {
    return false;
  }
}
