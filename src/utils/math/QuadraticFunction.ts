/**
 * QuadraticFunction - generator for points in a quadratic function of the form ax^2+bx+c
 *
 * @param  {number} [a=1]         a in the quadratic form
 * @param  {number} [b=0]         b in the quadratic form
 * @param  {number} [c=0]         c in the quadratic form
 * @param  {number} [start=0]     where to start generating x values from
 * @param  {number} [increment=1] the step to incre
 * @param  {number} [end*]         optional ending number in the generation. may continue forever
 * @return {number[]} a two-ary array of [x,y] point in the quadratic function.
 */
export default function* (a = 1, b = 0, c = 0, start = 0, increment = 1, end: any) {
  while ((!end && end !== 0) || start < end) {
    yield [start, a * start * start + b * start + c];
    start += increment;
  }
}
