import { CanvasState } from '../../CanvasState';
import { DragState } from '../../../utils/SvgDraggable';
import VectorUtils from '../../../utils/math/VectorUtils';
import { CanvasTool, Tool } from '../Tool';
import { MoveTool } from '../object/MoveTool';
import { RenderableObject } from 'components/objects/RenderableObject';

export class MoveCanvasTool implements CanvasTool<CanvasState> {
  constructor() {}
  getObjectTool(r: RenderableObject, index: number | null): Tool<any> {
    return new MoveTool(r, index);
  }
  onDrag(evt: DragEvent, canvasState: CanvasState, dragState: DragState, onUpdateState: any) {
    const { viewport } = canvasState;
    const newViewport = viewport.movePixels(VectorUtils.scalarMultiply(dragState.delta, -1));

    const newState = { ...canvasState, viewport: newViewport };

    onUpdateState(newState);
  }
  canBeOverridden() {
    return false;
  }
}
