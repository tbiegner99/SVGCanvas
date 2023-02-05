import { Point } from '../../utils/math/Point';
import { BaseSerializer } from './BaseSerializer';
import { ObjectSerializer } from './RenderableObjectSerializer';
import { RenderableRectangle } from '../../components/objects/types/Rectangle';

export class RectangleSerializerV1
  extends BaseSerializer<RenderableRectangle>
  implements ObjectSerializer<RenderableRectangle>
{
  supports(typeId: string, version: number): boolean {
    return typeId?.toLowerCase() === 'builtin:rect' && version < 2;
  }

  serialize(object: RenderableRectangle) {
    return {
      ...super.serialize(object),
      size: object.size,
    };
  }
  deserialize(object: any): RenderableRectangle {
    const size = object['size'];
    const location = object['location'] as Point;
    return new RenderableRectangle(size, location, super.deserializeRenderOptions(object));
  }
}
