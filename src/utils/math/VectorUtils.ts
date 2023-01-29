export type Vector = Array<number>;

export default class VectorUtils {
  static vectorPerElementOperation<T extends Vector>(
    reducingFunc: (item: number, index: number) => number,
    ...vecs: T[]
  ): T {
    let ret = vecs[0];
    const toExecutionForItem = (item: number, index: number) => reducingFunc(item, ret[index]);
    for (let i = 1; i < vecs.length; i++) {
      ret = vecs[i].map(toExecutionForItem) as T;
    }
    return ret;
  }

  static scalarOperation<T extends Vector>(
    vector: T,
    operation: (item: number, index: number) => number
  ): T {
    return vector.map(operation) as T;
  }

  static assertSameLength(vec1: Vector, vec2: Vector, msg?: string) {
    if (vec1.length !== vec2.length) {
      throw new Error(msg || 'Vectors not same length');
    }
  }

  static max<T extends Vector>(...vecs: T[]) {
    return VectorUtils.vectorPerElementOperation(Math.max, ...vecs);
  }

  static min<T extends Vector>(...vecs: T[]) {
    return VectorUtils.vectorPerElementOperation(Math.min, ...vecs);
  }

  static abs<T extends Vector>(vec1: T): T {
    return VectorUtils.scalarOperation(vec1, (item) => Math.abs(item)) as T;
  }

  static magnitude<T extends Vector>(vec1: T): number {
    return Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  }

  static add<T extends Vector>(...vecs: T[]): T {
    return VectorUtils.vectorPerElementOperation((item, lastVal) => item + lastVal, ...vecs);
  }

  static average<T extends Vector>(...vecs: T[]): T {
    return VectorUtils.scalarMultiply(VectorUtils.add(...vecs), 1 / vecs.length);
  }

  static midpoint<T extends Vector>(vec1: T, vec2: T) {
    return VectorUtils.average(vec1, vec2);
  }

  static subtract<T extends Vector>(...vecs: T[]) {
    return VectorUtils.vectorPerElementOperation((item1, lastVal) => lastVal - item1, ...vecs);
  }

  static scalarMultiply<T extends Vector>(vec1: T, operand: number): T {
    return VectorUtils.scalarOperation(vec1, (item) => item * operand);
  }

  static componentMultiply<T extends Vector>(...vecs: T[]) {
    return VectorUtils.vectorPerElementOperation((item, lastVal) => item * lastVal, ...vecs);
  }

  static componentDivide<T extends Vector>(vec1: T, vec2: T) {
    return VectorUtils.scalarOperation(vec1, (item, index) => item / vec2[index]);
  }

  static multiply<T extends Vector>(vec1: T, vec2: T) {
    return vec1.map((item, index) => item * vec2[index]).reduce((acc, val) => acc + val, 0);
  }

  static bound<T extends Vector>(vec: T, min: T, max: T) {
    min = min || VectorUtils.fillVector(Number.MIN_VALUE, vec.length);
    max = max || VectorUtils.fillVector(Number.MAX_VALUE, vec.length);
    return VectorUtils.min(VectorUtils.max(vec, min), max);
  }

  static fillVector(size: number, length: number): Vector {
    return Array(length).fill(Number.MIN_VALUE);
  }

  static euclideanDistance<T extends Vector>(vec1: T, vec2: T): number {
    return VectorUtils.magnitude(VectorUtils.subtract(vec1, vec2));
  }

  static dotProduct<T extends Vector>(vec1: T, vec2: T): number {
    return vec1.map((item, index) => item * vec2[index]).reduce((acc, val) => acc + val, 0);
  }
}
