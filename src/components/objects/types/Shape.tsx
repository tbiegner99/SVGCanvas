import { Path } from './Path';

export class Shape extends Path {
  getTypeId(): string {
    return 'builtin:shape';
  }

  getVersion(): number {
    return 1;
  }
  buildPath() {
    return super.buildPath() + ' Z';
  }
}
