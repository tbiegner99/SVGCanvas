import { RenderableObject } from '../objects/RenderableObject';
import { CanvasState } from '../CanvasState';
import { DragEvents } from '../../utils/SvgDraggable';

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
