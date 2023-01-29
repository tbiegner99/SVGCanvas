import { Viewport } from '../../../models/Viewport';
import VectorUtils from '../../../utils/math/VectorUtils';
import { HandlerState, Tool } from '../Tool';
import { DragState } from '../../../utils/DragState';
import { CanvasState } from '../../../components/CanvasState';

export class MoveTool implements Tool<HandlerState> {
  private canvasState: CanvasState;
  constructor(canvasState: CanvasState) {
    this.canvasState = canvasState;
    console.log('CON', this.canvasState);
  }
  onDragEnd(evt: DragEvent, dragState: DragState<HandlerState>) {
    evt.stopImmediatePropagation();
  }
  onDrag(evt: DragEvent, dragState: DragState<HandlerState>, onUpdateState: any) {
    if (!dragState.target.object.isMovable()) {
      return dragState.target;
    }
    var object = dragState.target.object;
    var { viewport } = this.canvasState;
    var movementUnits = VectorUtils.scalarOperation(dragState.delta, (item) =>
      Viewport.pixelsToUnits(item, viewport.scale)
    );
    object.move(movementUnits);
    const newState = { ...this.canvasState };
    console.log(this.canvasState);
    onUpdateState(newState);
    return { ...dragState.target, canvasState: newState };
  }
  onDragStart(evt: MouseEvent, dragState: DragState<HandlerState>): HandlerState {
    evt.stopPropagation();
    return dragState.target;
  }
  onMouseDown(evt: MouseEvent, target: HandlerState, onUpdateState: any) {
    if (target.objectIndex === undefined) {
      return;
    }
    console.log(target.objectIndex);
    onUpdateState({ ...this.canvasState, selectedObjectIndex: target.objectIndex });
  }
  canBeOverridden() {
    return false;
  }
}
