import React from 'react';
import { RenderableObject } from './objects/RenderableObject';
import VectorUtils from '../utils/math/VectorUtils';
import { CanvasState } from './CanvasState';
import { CanvasDraggable } from './elements/CanvasDraggable';
import { Rectangle } from '../utils/math/geometry/Rectangle';
export const CanvasObject = ({
  object,
  index,
  renderOptions,
  canvasState,
}: {
  object: RenderableObject;
  index: number | null;
  canvasState: CanvasState;
  renderOptions: { canUseTool?: boolean; snap?: number };
}) => {
  const relativeBoundingRect = object.getBoundingRectangle();
  const absoluteBoundinggRect = new Rectangle(object.getLocation(), relativeBoundingRect.size);
  if (!canvasState.viewport.contains(absoluteBoundinggRect)) {
    return null;
  }
  const {
    currentTool,
    options: { snap },
  } = canvasState;
  const { canUseTool = true } = renderOptions;

  const location = object.getLocation();
  const snapLocation =
    snap > 0
      ? VectorUtils.scalarOperation(location, (el) => Math.floor(el / snap) * snap)
      : location;
  const boundedLocation = VectorUtils.max([0, 0], snapLocation);
  const objectTool = canUseTool ? currentTool.getObjectTool(object, index, canvasState) : undefined;

  return (
    <svg
      style={{
        overflow: 'visible',
        cursor: object.isMovable() ? 'pointer' : 'auto',
        pointerEvents: canUseTool ? 'all' : 'none',
      }}
      x={boundedLocation[0]}
      y={boundedLocation[1]}
      id={object.getId().replace(/-/g, '_')}
      key={object.getId()}
    >
      <g
        transform={`translate(${-1 * relativeBoundingRect.topLeft[0]}, ${
          -1 * relativeBoundingRect.topLeft[1]
        } ) rotate(${object.rotation || 0})`}
      >
        <CanvasDraggable tool={objectTool}>{object.render()}</CanvasDraggable>
      </g>
    </svg>
  );
};
