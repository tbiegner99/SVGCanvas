import { Point } from './Point';

/**
 * Represents a line of the form y=ax+b. Since this is a function, it cannot represent
 * vertical lines
 */
export default class LinearFunction {
  /**
   * constructor - takes a and b  or 2 points on a line segment in which case the equation for the
   * line will be calculated
   *
   * @param  {Number | Number[]} [a=1] a  number representing a in ax+b form or a point ([x,y]) for the start of a line segment
   * @param  {Number | Number[]} [b=0] a  number representing b in ax+b form or a point ([x,y]) for the end of a line segment
   * @return {LinearFunction}     a new Linear Function object
   * @throws  {Error} if parameter types are invalid or exactly 1 point and one number is passed.
   */
  private a: number;
  private b: number;
  constructor(a = 1, b = 0) {
    this.a = a;
    this.b = b;
  }

  /**
   * get slope - returns the slope of the line (a in ax+b form)
   * @return {Number} the slope of the line
   */
  get slope() {
    return this.a;
  }

  /**
   * get intercept - returns the y intercept of the line (b in ax+b form)
   * @return {Number} the y intercept of the line
   */
  get intercept() {
    return this.b;
  }

  /**
   * get xIntercept - returns the x intercept of the line (where the line crosses the x axis)
   * @return {Number} the x intercept of the line
   */
  get xIntercept() {
    if (!this.a) {
      return null; // horizontal lines have no x intercept
    }
    return -this.b / this.a;
  }

  /**
   * evaluateAt - evalues the y value of a line at the given x coodinate
   * @param  {Number} [x1=0] description
   * @return {Number} the y value of the line
   */
  evaluateAt(x1 = 0) {
    return this.a * x1 + this.b;
  }

  /**
   * lineDistance - computes the lengtrh of the line between to x points on the line
   * @param  {Number} x1 the starting point of the segment
   * @param  {Number} x2 the ending point of the segment
   * @return {Number} the length of the segment
   */
  lineDistance(x1: number, x2: number): number {
    const y1 = this.evaluateAt(x1);
    const y2 = this.evaluateAt(x2);
    const rise = y2 - y1;
    const run = x2 - x1;
    return Math.sqrt(rise * rise + run * run);
  }

  /**
   * midpoint - calculates the midpoint of a segment between x1 and x2
   * @param  {Number} x1 the start x of the segment
   * @param  {Number} x2 the end x of the segment
   * @return {Number[]} a point representing the midpoint
   */
  midpoint(x1: number, x2: number): Point {
    const midx = (x1 + x2) / 2;
    return [midx, this.evaluateAt(midx)];
  }

  /**
   * perpendicularLine - calculates a line that intersects this line at a given x coodinate and is perpendicular to this line
   * a perpendicular line makes a 90 deg angle with this line. its slope is the negative inverse of the slope of this line
   * @param  {Number} x1 the x coordinat of the intersection point
   * @return {LinearFunction} a linear function representing the line that intersects the line at x1
   * and is perfpendicular to this line
   * @throws {Error} if this line is horizontal
   */
  perpendicularLine(x1: number): LinearFunction {
    if (this.a === 0) {
      throw new Error('Undefined slope');
    }
    const a = -1 / this.a;
    const y = this.evaluateAt(x1);
    const b = y - a * x1;
    return new LinearFunction(a, b);
  }

  pointAboveMidPoint(x1: number, x2: number, distance: number): Point {
    return this.pointAboveLine(this.midpoint(x1, x2)[0], distance);
  }

  pointAboveLine(x1: number, distance: number): Point {
    if (this.a === 0) {
      return [x1, this.evaluateAt(x1) + distance];
    }
    // the distance along a line between x values
    // well use this as part of similar triangle calculation
    const perpendicular = this.perpendicularLine(x1);
    // note slope uill not be 0 since you can instantiate this object with undefined slope
    const unitSlopeHypoteneuse = Math.sqrt(perpendicular.a * perpendicular.a + 1); // realy +1^2
    if (unitSlopeHypoteneuse === perpendicular.a) {
      // this is a case to avoid approximation errors. This is nearly a horizxontal line
      return [x1, this.evaluateAt(x1) + distance];
    }
    // sHyp/distance=1/dX
    const neg = -this.a / Math.abs(this.a); // only negate if slope is positive
    const dx = (neg * distance) / unitSlopeHypoteneuse;
    return [x1 + dx, perpendicular.evaluateAt(x1 + dx)];
  }

  generate(start = 0, increment = 1, end?: number) {
    const generator = function* (
      this: LinearFunction,
      start: number,
      increment: number,
      end?: number
    ) {
      while (!end || start < end) {
        yield [start, this.evaluateAt(start)];
        start += increment;
      }
    };
    return generator.bind(this)(start, increment, end);
  }
}
