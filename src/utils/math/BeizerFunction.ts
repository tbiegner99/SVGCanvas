import { Point } from './Point';
import VectorUtils from './VectorUtils';

export class BeizerFunction {
  private currentStep: number;
  private steps: number;
  private controlPoints: Point[];
  private increment: number;
  private start: Point;
  private end: Point;
  constructor(start: Point, end: Point, steps = 100, ...controlPoints: Point[]) {
    this.currentStep = 0;
    this.steps = steps - 1;
    this.start = start;
    this.end = end;
    this.controlPoints = controlPoints;
    this.increment = VectorUtils.magnitude(VectorUtils.subtract(end, start)) / steps;
  }

  interpolate(controlPoints: Point[], pctStep: number): Point[] {
    const ret: Point[] = [];
    for (
      let currentPoint = 0, nextPoint = 1;
      nextPoint < controlPoints.length;
      currentPoint++, nextPoint++
    ) {
      const p1 = controlPoints[currentPoint];
      const p2 = controlPoints[nextPoint];
      const slopeVector = VectorUtils.scalarMultiply(VectorUtils.subtract(p2, p1), pctStep);
      ret.push(VectorUtils.add(p1, slopeVector) as Point);
    }
    return ret;
  }

  evaluateAt(point: Point) {
    let pctStep;
    pctStep = Math.abs((point[0] - this.start[0]) / (this.end[0] - this.start[0]));

    pctStep = Math.max(Math.min(pctStep, 1), 0);
    if (pctStep > 1 || pctStep < 0) {
      throw new Error(
        `Argument out of function range: ${point[0]}\r\n Range: [${this.start[0]},${this.end[0]}]`
      );
    }

    return this.evaluateAtPct(pctStep);
  }

  evaluateAtPct(pctStep: number): Point {
    let allControlPoints = [this.start, ...this.controlPoints, this.end];
    while (allControlPoints.length > 1) {
      allControlPoints = this.interpolate(allControlPoints, pctStep);
    }
    return allControlPoints[0];
  }

  evaluateAtStep(step: number): Point {
    if (step > this.steps || step < 0) {
      throw new Error('No such step.');
    }
    return this.evaluateAtPct(step / this.steps);
  }

  generate(stepIncrement = 1) {
    return function* (this: BeizerFunction, step: number, stepIncrement: number) {
      while (step <= this.steps) {
        yield this.evaluateAtStep(step);
        step += stepIncrement;
      }
    }.bind(this)(0, stepIncrement);
  }
}
export const Beizer = function* (start: Point, end: Point, steps = 100, ...controlPoints: Point[]) {
  const beizer = new BeizerFunction(start, end, steps, ...controlPoints);
  yield* beizer.generate();
};
