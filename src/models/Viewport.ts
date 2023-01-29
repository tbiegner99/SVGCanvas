import { Rectangle } from '../utils/math/geometry/Rectangle';
import { Dimension } from '../utils/math/Dimension';
import { Point } from '../utils/math/Point';
import VectorUtils from '../utils/math/VectorUtils';
import Vector from '../utils/math/VectorUtils';

const PIXELS_PER_UNIT = 4;
export class Viewport {
  private _size: Dimension;
  private _baseSize: Dimension;
  private _zoom: number;
  private _location: Point;
  private _locationInPixels: Point;
  constructor(_baseSize: Dimension, _zoom: number = 1, _location: Point = [0, 0]) {
    this._baseSize = _baseSize;
    this._zoom = _zoom;

    this._size = Vector.scalarMultiply(_baseSize, 1 / _zoom);
    this._location = Vector.bound(_location, [0, 0], Vector.subtract(this._baseSize, this.size));

    this._locationInPixels = VectorUtils.scalarOperation(this._location, (item) =>
      Viewport.unitsToPixels(item, _zoom)
    );
  }
  static assertAspectRatio(pixelSize: Dimension, ratio: number): Dimension {
    if (pixelSize[0] / pixelSize[1] < ratio) {
      return [pixelSize[1] * ratio, pixelSize[1]];
    }
    return [pixelSize[0], pixelSize[0] / ratio];
  }

  static pointFromPixels(pixelSize: Dimension, zoom: number): Point {
    const convertItem = (item: number) => Viewport.pixelsToUnits(item, zoom);
    const unitSize = VectorUtils.scalarOperation(pixelSize, convertItem);
    return unitSize;
  }

  static fromPixels(pixelSize: Dimension, zoom: number, location: Point = [0, 0]) {
    const unitSize = Viewport.pointFromPixels(pixelSize, zoom);
    const unitLocation = Viewport.pointFromPixels(location, zoom);
    return new Viewport(unitSize, zoom, unitLocation);
  }

  static pixelsToUnits(pixels: number, zoom: number): number {
    return pixels / zoom / PIXELS_PER_UNIT;
  }

  static unitsToPixels(units: number, zoom: number): number {
    return units * PIXELS_PER_UNIT;
  }

  get baseSize(): Dimension {
    return this._baseSize;
  }
  get size() {
    return this._size;
  }
  get scale() {
    return this._zoom;
  }

  get locationInPixels() {
    return this._locationInPixels;
  }

  get location(): Point {
    return this._location;
  }

  contains(rect: Rectangle): boolean {
    return rect.overlaps(new Rectangle(this.location, this.size));
  }

  resizePixels(dimension: Dimension) {
    return Viewport.fromPixels(dimension, this.scale, this.location);
  }

  zoom(scale: number): Viewport {
    return new Viewport(this.baseSize, scale, this.location);
  }

  movePixels(moveAmount: Dimension): Viewport {
    return this.move(
      VectorUtils.scalarOperation(moveAmount, (item) => Viewport.pixelsToUnits(item, this.scale))
    );
  }

  move(moveAmount: Dimension): Viewport {
    let newLocation = Vector.add(this.location, moveAmount);
    newLocation = Vector.min(newLocation, Vector.subtract(this._baseSize, this.size));
    newLocation = Vector.max(newLocation, [0, 0]);

    return new Viewport(this.baseSize, this.scale, newLocation);
  }
}
