import React from "react"
import { CanvasStateContext } from "components/context/CanvasStateContext"

export const CanvasDraggable = ()=> {
  return <CanvasStateContext.Consumer>
    {canvasState=>
      <div/>
    }
  </CanvasStateContext.Consumer>
}