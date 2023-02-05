import { RenderOptions, RenderableObject } from '../../components/objects/RenderableObject';
import { ObjectSerializer } from './RenderableObjectSerializer';

export abstract class BaseSerializer<T extends RenderableObject> implements ObjectSerializer<T> {
  serialize(object: T) {
    return {
      type: object.getTypeId(),
      version: object.getVersion(),
      location: object.getLocation(),
      id: object.getId(),
      zIndex: object.zIndex || 0,
      rotation: object.rotation || 0,
      ...object.getRenderOptions(),
    };
  }
  deserializeRenderOptions(object: any): RenderOptions {
    return {
      fill: object['fill'],
      stroke: object['stroke'],
      strokeWidth: object['strokeWidth'],
    };
  }
  abstract deserialize(any: any): T;
  abstract supports(typeId: string, version: number): boolean;
}
