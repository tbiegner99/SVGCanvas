import { Dimension } from '../utils/math/Dimension';
import { CanvasObject } from './objects/Object';
import { Serializable } from './Serializable';
import { Settings } from './Settings';
import { Viewport } from './Viewport';

export class CanvasModel implements Serializable {
  private _objects: Array<CanvasObject>;
  private _viewport: Viewport;
  private _settings?: Settings;

  constructor(size: Dimension = [100, 100], settings?: Settings) {
    this._viewport = new Viewport(size, 1, [0, 0]);
    this._settings = settings;
    this._objects = [];
  }

  get settings() {
    return this._settings;
  }

  get viewport() {
    return this._viewport;
  }

  toJSON() {
    return {
      objects: this._objects.map((object) => object.toJSON()),
      size: this.viewport.size,
    };
  }
}
