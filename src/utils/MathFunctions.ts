import LinearFunction from './math/LinearFunction';
import QuadraticFunction from './math/QuadraticFunction';
import { Beizer, BeizerFunction } from './math/BeizerFunction';

import GraphicsUtils from './math/GraphicsUtils';
import VectorUtils from './math/VectorUtils';

const precision = (places: number, number: number) => {
  if (places < 0) {
    throw new Error('precision must be >= 0');
  }
  const place = Math.pow(10, places);

  if (number < 0) {
    return Math.ceil(number * place) / place; // floor does opposite for negative numbers
  }
  return Math.floor(number * place) / place; // clip, dont round
};

/**
 * range- similar to the Python range function creates an array of numbers from start to stop incrementing by step.
 * Examples:
 * range(3,0,-1)->[3,2,1]
 * range(3)->[0,1,2]
 * @param  {number} [start=10] description
 * @param  {number} stop     description
 * @param  {number} [step=1]   step to increment by
 * @return {number[]}          description
 */
const range = (start = 10, stop = 0, step = 1): Array<number> => {
  if (step === 0) {
    throw new Error('range step cannot be 0');
  }
  if (!stop && stop !== 0) {
    stop = start;
    start = 0;
  }
  const gen = new LinearFunction(step, start).generate(0, 1, (stop - start) / step);
  return Array.from([...gen]).map((item) => item[1]);
};

export {
  LinearFunction,
  Beizer,
  BeizerFunction,
  GraphicsUtils,
  VectorUtils,
  QuadraticFunction,
  precision,
  range,
};
