
import React, {useState,useRef,useEffect} from "react"
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

}

export interface DraggableProps<T> extends DragEvents<T> {
  state:T;
  onUpdateState:(newState:T)=>any;
  [x:string]:any
}

export function SvgDraggable<T>({
  onDragEnd,onDrag,onMouseMove,onMouseDown,onDragStart,onDragLeave,onClick,state,onUpdateState:setState,...otherProps}:DraggableProps<T>) {
  const [dragState,_setDragState] = useState<DragState | null>(null)
  const stateRef= useRef(dragState)
  const setDragState = (s:DragState | null)=>{
    stateRef.current=s;
    // console.log("UPDATING",s,stateRef)
    _setDragState(s);
    
  }
 
  const mouseMove = (evt:MouseEvent) =>{
    let dragState = stateRef.current
    if( !dragState || !dragState.isDragging) {
      return;
    }
    if(onMouseMove) {
      onMouseMove(evt,state,setState)
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
    stateRef.current=newDragState
    setDragState(newDragState)
    console.log(stateRef.current)
    if(onDrag) {
    onDrag(evt,state,newDragState,setState);
    }
  
  }
  const mouseUp=(evt:MouseEvent)=> {
    let dragState = stateRef.current
    if( !dragState ||  !dragState.isDragging) {
      return;
    }
    const endDragState = {
      delta:[0,0] as Point,
      totalDelta:dragState!.totalDelta,
      start:dragState!.start,
      end:[evt.clientX,evt.clientY] as Point,
      isDragging:false,
      hasDragStarted:false
    }
    setDragState(null)
    if(onDragEnd) {
      onDragEnd(evt,state,endDragState,setState)
    }
  }

  const mouseDown=(evt:MouseEvent) =>{
    evt.stopPropagation();
    if(onMouseDown) {
      onMouseDown(evt,state,setState)
    }

    
    const newDragState = {
      isDragging:true,
      hasDragStarted:true,
      delta:[0,0] as Point,
      totalDelta:[0,0]  as Point,
      start:[evt.clientX,evt.clientY]  as Point,
      end:[evt.clientX,evt.clientY]  as Point,
    }
    stateRef.current=newDragState;
    console.log("MOUSE DOWN",newDragState,stateRef)
    setDragState(newDragState)

    if(onDragStart) {
      onDragStart(evt,state,newDragState,setState);
    }


  }
  useEffect(()=>{
    window.addEventListener("mousemove", mouseMove)
    window.addEventListener("mouseup", mouseUp)
    return ()=>{
      console.log("unmounting")
      window.removeEventListener("mousemove",mouseMove);
      window.removeEventListener("mouseup",mouseUp);
    }
  },[])
  const click = (evt:MouseEvent)=> {
    if(onClick) {
      onClick(evt,state,setState)
      }
    
  }
  
  return <g onClick={click as any} onMouseDown={mouseDown as any} {...otherProps}></g>
 
}

