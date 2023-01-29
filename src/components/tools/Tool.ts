import { RenderableObject } from '../objects/RenderableObject';
import { CanvasState } from '../CanvasState';
import { DragEvents } from '../../utils/DragState';

export interface Tool<T> extends DragEvents<T> {
  canBeOverridden(): boolean;
}
export interface CanvasTool<T> extends Tool<T> {
  getObjectTool(r: RenderableObject, state: CanvasState): Tool<any> | null;
}
export interface HandlerState {
  object: RenderableObject;
  objectIndex?: number;
  canvasState: CanvasState;
}
