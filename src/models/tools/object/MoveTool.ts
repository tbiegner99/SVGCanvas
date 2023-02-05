import { Viewport } from '../../Viewport';
import VectorUtils from '../../../utils/math/VectorUtils';
import { Tool } from '../Tool';
import { DragState } from '../../../components/elements/SvgDraggable';
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
    var objects = canvasState.selectedObjectIndicies.map((i) => canvasState.objects[i]);
    var { viewport } = canvasState;
    var movementUnits = VectorUtils.scalarOperation(dragState.delta, (item) =>
      Viewport.pixelsToUnits(item, viewport.scale)
    );
    objects.forEach((object) => {
      object.move(movementUnits);
    });

    const newState = { ...canvasState };
    onUpdateState(newState);
  }
  onMouseDown(evt: MouseEvent, target: CanvasState, onUpdateState: any) {
    if (!this.object.isSelectable() || this.objectIndex === null) {
      return;
    }
    evt.stopPropagation();
    let arr = [this.objectIndex];
    if (evt.ctrlKey) {
      const indicies = new Set(target.selectedObjectIndicies);
      indicies.add(this.objectIndex);
      arr = Array.from(indicies);
    }
    onUpdateState({ ...target, selectedObjectIndicies: arr });
  }
  canBeOverridden() {
    return false;
  }
}
