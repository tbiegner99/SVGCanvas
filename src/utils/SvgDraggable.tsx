
import React, {useState,useEffect} from "react"
import { Point } from './math/Point';
import { VectorUtils } from './MathFunctions';
export interface DragState {
  start:Point,
  delta:Point,
  totalDelta:Point,
  end:Point,
   isDragging:boolean ;
   hasDragStarted:boolean;
}
export interface DragEvents<T> {
  onDragEnd?:(evt: MouseEvent,state: T, dragState: DragState,onUpdateState:(newState:T)=>any)=>void;
  onDrag?:(evt: MouseEvent,state: T, dragState: DragState,onUpdateState:(newState:T)=>any)=>void;
  onDragStart?:(evt: MouseEvent,state: T, dragState: DragState,onUpdateState:(newState:T)=>any)=>void
  onDragLeave?:(evt: MouseEvent,state: T, dragState: DragState,onUpdateState:(newState:T)=>any)=>void;
  onMouseMove?:(evt:MouseEvent,state:T,onUpdateState:(newState:T)=>any)=>void;
  onMouseDown?:(evt:MouseEvent,state:T,onUpdateState:(newState:T)=>any)=>void;
  onClick?:(evt:MouseEvent,state:T,onUpdateState:(newState:T)=>any)=>void;
  state:T;
  setState:(newState:T)=>any;
  [x:string]:any
}

export function SvgDraggable<T>(props:DragEvents<T>) {
  const [dragState,setDragState] = useState<DragState|null>(null)

  const onMouseMove = (evt:MouseEvent) =>{
    
    if(props.onMouseMove) {
      props.onMouseMove(evt,props.state,props.setState)
      }
      console.log(dragState)
    if(!dragState || !dragState.isDragging) {
      return;
    }
    var currentPoint:Point=[evt.clientX,evt.clientY]
    var delta=VectorUtils.subtract(currentPoint,dragState.end)
    const newDragState={
      delta,
      totalDelta:VectorUtils.add(dragState!.totalDelta,delta),
      start:dragState!.start,
      end:currentPoint,
      isDragging:true,
      hasDragStarted:true
    };
    setDragState(newDragState)
    if(props.onDrag) {
    props.onDrag(evt,props.state,newDragState,props.setState);
    }
  
  }
  const onMouseUp=(evt:MouseEvent)=> {
    cancelDrag()
    const endDragState = {
      delta:[0,0] as Point,
      totalDelta:dragState!.totalDelta,
      start:dragState!.start,
      end:[evt.clientX,evt.clientY] as Point,
      isDragging:false,
      hasDragStarted:false
    }
    if(props.onDragEnd) {
      props.onDragEnd(evt,props.state,endDragState,props.setState)
    }
  }

  const onMouseDown=(evt:MouseEvent) =>{
    evt.stopPropagation();
    if(props.onMouseDown) {
      props.onMouseDown(evt,props.state,props.setState)
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    
    const newDragState = {
      isDragging:true,
      hasDragStarted:true,
      delta:[0,0] as Point,
      totalDelta:[0,0]  as Point,
      start:[evt.clientX,evt.clientY]  as Point,
      end:[evt.clientX,evt.clientY]  as Point,
    }
    if(props.onDragStart) {
      props.onDragStart(evt,props.state,newDragState,props.setState);
    }
    setDragState(dragState)

  }
  const cancelDrag=() =>{
    window.removeEventListener("mousemove",onMouseMove);
   window.removeEventListener("mouseup",onMouseUp);
 }
  const onClick = (evt:MouseEvent)=> {
    if(props?.onClick) {
      props.onClick(evt,props.state,props.setState)
      }
    
  }
  
  return <g onClick={onClick as any} onMouseDown={onMouseDown as any}>

  </g>
 
}

