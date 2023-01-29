import { RenderableObject, RenderableObjectFactory } from '../../objects/RenderableObject';
import { CanvasState } from '../../CanvasState';
import { DragState } from '../../../utils/DragState';
import VectorUtils from '../../../utils/math/VectorUtils';
import { Viewport } from '../../../models/Viewport';
import { ObjectDropTool } from '../object/ObjectDropTool';
import { CanvasTool, Tool } from '../Tool';

export class CanvasDropTool implements CanvasTool<CanvasState> {
  private setState: (state: any) => any;
  private dropObject?: RenderableObject;
  dropObjectFactory: RenderableObjectFactory;
  constructor(dropObjectFactory: RenderableObjectFactory, setState: (state: any) => any) {
    this.dropObjectFactory = dropObjectFactory;
    this.setState = setState;
  }
  getObjectTool(r: RenderableObject): Tool<any> {
    return new ObjectDropTool(r, (r?: RenderableObject) => (this.dropObject = r));
  }
  onClick(evt: MouseEvent, target: CanvasState) {
    if (!this.dropObjectFactory.canDropObjectOn(this.dropObject)) {
      this.dropObject = undefined;
      return;
    }
    this.dropObject = undefined;
    const viewportLocation = VectorUtils.add(
      Viewport.pointFromPixels([evt.clientX, evt.clientY], target.viewport.scale),
      target.viewport.location
    );

    this.setState({
      ...target,
      objects: [...target.objects, this.dropObjectFactory.getRenderObject(viewportLocation)],
    });
  }

  onMouseMove(evt: MouseEvent, target: CanvasState) {
    const viewportLocation = VectorUtils.add(
      Viewport.pointFromPixels([evt.clientX, evt.clientY], target.viewport.scale),
      target.viewport.location
    );
    this.setState({
      ...target,
      createObject: this.dropObjectFactory.getRenderObject(viewportLocation),
    });
  }

  canBeOverridden() {
    return false;
  }
}
