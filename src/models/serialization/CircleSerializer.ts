import { Point } from '../../utils/math/Point';
import { RenderableCircle } from '../../components/objects/types/Circle';
import { BaseSerializer } from './BaseSerializer';
import { ObjectSerializer } from './RenderableObjectSerializer';

export class CircleSerializerV1
  extends BaseSerializer<RenderableCircle>
  implements ObjectSerializer<RenderableCircle>
{
  supports(typeId: string, version: number): boolean {
    return typeId?.toLowerCase() === 'builtin:circle' && version < 2;
  }

  serialize(object: RenderableCircle) {
    return {
      ...super.serialize(object),
      radius: object.radius,
    };
  }
  deserialize(object: any): RenderableCircle {
    const radius = object['radius'];
    const location = object['location'] as Point;
    return new RenderableCircle(radius, location, super.deserializeRenderOptions(object));
  }
}
