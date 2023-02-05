import React from 'react';

import { RenderableObject } from '../objects/RenderableObject';
import VectorUtils from '../../utils/math/VectorUtils';
import { Point } from '../../utils/math/Point';

import { Rectangle } from '../../utils/math/geometry/Rectangle';

const Nub = (props: { location: Point; scale: number; cursor: string }) => {
  const { cursor, location, scale } = props;
  return (
    <svg
      style={{ transform: `scale(${1 / scale})`, overflow: 'visible', cursor }}
      x={location[0]}
      y={location[1]}
    >
      <circle r={0.75} strokeWidth={0.125} stroke="black" fill="gray" />
    </svg>
  );
};

export const SelectedObjectNubs = (props: {
  scale: number;
  object: RenderableObject;
  snap: number;
}) => {
  const { object, snap, scale } = props;
  if (!object) {
    return null;
  }
  const rawRect = object.getBoundingRectangle();
  const location = object.getLocation();
  const snapLocation =
    snap > 0
      ? VectorUtils.scalarOperation(location, (el) => Math.floor(el / snap) * snap * scale)
      : location;
  const boundedLocation: Point = VectorUtils.max([0, 0], snapLocation);
  const rect = new Rectangle(boundedLocation, VectorUtils.scalarMultiply(rawRect.size, scale));
  return (
    <g>
      <Nub scale={scale} cursor="nw-resize" location={rect.topLeft} />
      <Nub scale={scale} cursor="ne-resize" location={rect.topRight} />
      <Nub scale={scale} cursor="sw-resize" location={rect.bottomLeft} />
      <Nub scale={scale} cursor="se-resize" location={rect.bottomRight} />
      <Nub scale={scale} cursor="n-resize" location={rect.topCenter} />
      <Nub scale={scale} cursor="s-resize" location={rect.bottomCenter} />
      <Nub scale={scale} cursor="e-resize" location={rect.leftCenter} />
      <Nub scale={scale} cursor="w-resize" location={rect.rightCenter} />
    </g>
  );
};
