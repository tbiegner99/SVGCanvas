import { CanvasState } from '../../CanvasState';
import { DragState } from '../../../utils/DragState';
import VectorUtils from '../../../utils/math/VectorUtils';
import { CanvasTool, Tool } from '../Tool';
import { MoveTool } from '../object/MoveTool';

export class MoveCanvasTool implements CanvasTool<CanvasState> {
  constructor() {}
  getObjectTool(r: any, canvasState: CanvasState): Tool<any> | null {
    return new MoveTool(canvasState);
  }
  onDragEnd(evt: DragEvent, dragState: DragState<CanvasState>, onUpdateState: any) {}
  onDrag(evt: DragEvent, dragState: DragState<CanvasState>, onUpdateState: any) {
    const viewport = dragState.target.viewport;
    const newViewport = viewport.movePixels(VectorUtils.scalarMultiply(dragState.delta, -1));

    const newState = { ...dragState.target, viewport: newViewport };

    onUpdateState(newState);
    return newState;
  }
  onDragStart(evt: MouseEvent, dragState: DragState<CanvasState>): CanvasState {
    return dragState.target;
  }
  canBeOverridden() {
    return false;
  }
}
