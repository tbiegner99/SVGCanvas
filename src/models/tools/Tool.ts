import { RenderableObject } from '../../components/objects/RenderableObject';
import { CanvasState } from '../../components/CanvasState';
import { DragEvents } from '../../components/elements/SvgDraggable';

export interface Tool<T> extends DragEvents<T> {
  canBeOverridden(): boolean;
}
export interface CanvasTool<T> extends Tool<T> {
  getObjectTool(
    r: RenderableObject,
    objectIndex: number | null,
    state: CanvasState
  ): Tool<any> | undefined;
}
export interface HandlerState {
  object: RenderableObject;
  objectIndex?: number;
  canvasState: CanvasState;
}
