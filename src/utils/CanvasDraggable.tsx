import React from "react"
import { CanvasStateContext } from "../components/context/CanvasStateContext"
import { SvgDraggable } from "./SvgDraggable"
import { Tool } from "../components/tools/Tool"

export const CanvasDraggable = ({tool,...otherProps}:{tool?:Tool<any>,[x:string]:any})=> {
  const {canvasState,setCanvasState} =React.useContext(CanvasStateContext)
  return  <SvgDraggable {...otherProps} 
      onClick={tool?.onClick} 
      onDrag={tool?.onDrag} 
      onDragEnd={tool?.onDragEnd} 
      onDragStart={tool?.onDragStart}
      onMouseDown={tool?.onMouseDown} 
      onMouseMove={tool?.onMouseMove}
      state={canvasState} 
      onUpdateState={setCanvasState}></SvgDraggable>
}