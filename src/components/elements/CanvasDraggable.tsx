import React from 'react';
import { CanvasStateContext } from '../../models/context/CanvasStateContext';
import { SvgDraggable } from './SvgDraggable';
import { Tool } from '../../models/tools/Tool';

export const CanvasDraggable = ({
  tool,
  ...otherProps
}: {
  tool?: Tool<any>;
  [x: string]: any;
}) => {
  const { canvasState, setCanvasState } = React.useContext(CanvasStateContext);
  return (
    <SvgDraggable
      {...otherProps}
      onClick={tool?.onClick?.bind(tool)}
      onDrag={tool?.onDrag?.bind(tool)}
      onDragEnd={tool?.onDragEnd?.bind(tool)}
      onDragStart={tool?.onDragStart?.bind(tool)}
      onMouseDown={tool?.onMouseDown?.bind(tool)}
      onMouseMove={tool?.onMouseMove?.bind(tool)}
      state={canvasState?.current}
      onUpdateState={setCanvasState}
    ></SvgDraggable>
  );
};
