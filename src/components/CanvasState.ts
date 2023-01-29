import { Viewport } from 'models/Viewport';
import { RenderableObject, RenderableObjectFactory } from './objects/RenderableObject';
import { CanvasTool } from './tools/Tool';
import { Dimension } from 'utils/math/Dimension';
export interface CanvasConfig {
  snap: number;
}

export interface CanvasState {
  options: CanvasConfig;
  createObject?: RenderableObject;
  dropObjectFactory?: RenderableObjectFactory;
  objects: RenderableObject[];
  viewport: Viewport;
  zoom: number;
  selectedObjectIndex?: number;
  currentTool: CanvasTool<any>;
  canvasSize: Dimension;
}
