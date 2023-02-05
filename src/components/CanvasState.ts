import { Viewport } from '../models/Viewport';
import { RenderableObject, RenderableObjectFactory } from './objects/RenderableObject';
import { CanvasTool } from '../models/tools/Tool';
import { Dimension } from '../utils/math/Dimension';
import { ShortcutHandler } from '../models/keyListener/ShortcutHandler';
export interface CanvasConfig {
  snap: number;
}

export interface CanvasState {
  options: CanvasConfig;
  handlers: ShortcutHandler[];
  createObject?: RenderableObject;
  dropObjectFactory?: RenderableObjectFactory;
  objects: RenderableObject[];
  viewport: Viewport;
  zoom: number;
  selectedObjectIndicies: number[];
  currentTool: CanvasTool<any>;
  canvasSize: Dimension;
}
