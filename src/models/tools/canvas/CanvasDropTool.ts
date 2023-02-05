import {
  RenderableObject,
  RenderableObjectFactory,
} from '../../../components/objects/RenderableObject';
import { CanvasState } from '../../../components/CanvasState';
import VectorUtils from '../../../utils/math/VectorUtils';
import { Viewport } from '../../Viewport';
import { ObjectDropTool } from '../object/ObjectDropTool';
import { CanvasTool, Tool } from '../Tool';
import { MoveCanvasTool } from './MoveCanvasTool';

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
    if (
      !this.dropObjectFactory.canCreateObject() ||
      !this.dropObjectFactory.canDropObjectOn(this.dropObject)
    ) {
      this.dropObject = undefined;
      return;
    }
    this.dropObject = undefined;
    const viewportLocation = VectorUtils.add(
      Viewport.pointFromPixels([evt.clientX, evt.clientY], target.viewport.scale),
      target.viewport.location
    );
    this.dropObjectFactory.onObjectCreated(1);
    var newTool = target.currentTool;
    if (!this.dropObjectFactory.canCreateObject()) {
      newTool = new MoveCanvasTool();
    }
    this.setState({
      ...target,
      objects: [...target.objects, this.dropObjectFactory.getRenderObject(viewportLocation)],
      currentTool: newTool,
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
