import { Viewport } from '../../../models/Viewport';
import VectorUtils from '../../../utils/math/VectorUtils';
import { Tool } from '../Tool';
import { DragState } from '../../../utils/SvgDraggable';
import { CanvasState } from '../../../components/CanvasState';
import { RenderableObject } from 'components/objects/RenderableObject';

export class MoveTool implements Tool<CanvasState> {
  private object: RenderableObject;
  private objectIndex: number | null;
  constructor(object: RenderableObject, objectIndex: number | null) {
    this.object = object;
    this.objectIndex = objectIndex;
  }
  onDrag(evt: DragEvent, canvasState: CanvasState, dragState: DragState, onUpdateState: any) {
    if (!this.object.isMovable()) {
      return;
    }
    var object = this.object;
    var { viewport } = canvasState;
    var movementUnits = VectorUtils.scalarOperation(dragState.delta, (item) =>
      Viewport.pixelsToUnits(item, viewport.scale)
    );
    object.move(movementUnits);
    const newState = { ...canvasState };
    console.log(canvasState);
    onUpdateState(newState);
  }
  onMouseDown(evt: MouseEvent, target: CanvasState, onUpdateState: any) {
    if (this.objectIndex === null) {
      return;
    }
    onUpdateState({ ...target, selectedObjectIndex: this.objectIndex });
  }
  canBeOverridden() {
    return false;
  }
}
