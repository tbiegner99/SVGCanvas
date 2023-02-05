import { RenderableObject } from '../../components/objects/RenderableObject';

export interface ObjectSerializer<T extends RenderableObject> {
  serialize(object: T): any;
  deserialize(any: any): T;
  supports(typeId: string, version: number): boolean;
}

export class RootSerializer implements ObjectSerializer<RenderableObject> {
  private serializers: ObjectSerializer<any>[];
  constructor(serializers: ObjectSerializer<any>[]) {
    this.serializers = serializers;
  }
  supports(typeId: string, version: number): boolean {
    return true;
  }

  serialize(object: RenderableObject) {
    const typeId = object.getTypeId();
    const version = object.getVersion();
    for (var s of this.serializers) {
      if (s.supports(typeId, version)) {
        return s.serialize(object);
      }
    }
    throw new Error('Unsupported type for serialization ' + typeId + ' version:' + version);
  }
  deserialize(object: any): RenderableObject {
    const typeId = object['type'];
    const version = object['version'];
    for (var s of this.serializers) {
      if (s.supports(typeId, version)) {
        return s.deserialize(object);
      }
    }
    throw new Error('Unsupported type for deserialization ' + typeId + ' version:' + version);
  }
}
