
import { Point } from './math/Point';
import { VectorUtils } from './MathFunctions';
export interface DragState<T> {
  start:Point,
  delta:Point,
  totalDelta:Point,
  end:Point,
  target:T,
   isDragging:boolean ;
   hasDragStarted:boolean;
}
export interface DragEvents<T> {
  onDragEnd(evt: MouseEvent, dragState: DragState<T>,onUpdateState:any):void;
  onDrag(evt: MouseEvent, dragState: DragState<T>,onUpdateState:any): T;
  onDragStart(evt: MouseEvent, dragState: DragState<T>,handler:DragHandler<T>,onUpdateState:any): T;
  onDragLeave?:(evt: MouseEvent, dragState: DragState<T>,onUpdateState:any)=>void;
  onMouseMove?:(evt:MouseEvent,target:T,onUpdateState:any)=>void;
  onMouseDown?:(evt:MouseEvent,target:T,onUpdateState:any)=>void;
  onClick?:(evt:MouseEvent,target:T,onUpdateState:any)=>void;

}

export class DragHandler<T> {
  private onDragStateChanged : (dragState: DragState<T> | null) => void;
  private dragState:DragState<T> | null = null
  private handler: DragEvents<T>
  private target: T;
  private mouseMoveListener :any
  private mouseUpListener :any
  constructor(handler:DragEvents<T>,target:T,dragState:DragState<T> |null=null,onDragStateChanged:(dragState:DragState<T>)=>void=()=>{}) {
    this.handler=handler;
    this.target=target;
    this.dragState=dragState;
    this.onDragStateChanged=onDragStateChanged;
  }
  getEvents(onUpdateState: any) :any{
    return {
      onMouseDown: this.onMouseDown.bind(this,onUpdateState),
      onMouseMove:this.onMouseMove.bind(this,onUpdateState),
      onClick:this.onClick.bind(this,onUpdateState),
      onMouseUp:this.onMouseUp.bind(this,onUpdateState)
    }
  }
  get dragHandler() : DragEvents<T>{
    return this.handler
  }

  cancelDrag() {
    window.removeEventListener("mousemove",this.mouseMoveListener);
    window.removeEventListener("mouseup",this.mouseUpListener);
  }

  onMouseDown(onUpdateState:any,evt:MouseEvent) {
    evt.stopPropagation();
    if(this.handler.onMouseDown) {
      this.handler.onMouseDown(evt,this.target,onUpdateState)
    }
    this.mouseMoveListener = this.onMouseMove.bind(this,onUpdateState);
    this.mouseUpListener =this.onMouseUp.bind(this,onUpdateState)
    window.addEventListener("mousemove", this.mouseMoveListener)
    window.addEventListener("mouseup", this.mouseUpListener)
    
    this.dragState = {
      isDragging:true,
      hasDragStarted:false,
      target:this.target,
      delta:[0,0],
      totalDelta:[0,0],
      start:[evt.clientX,evt.clientY],
      end:[evt.clientX,evt.clientY],
    }
    if(!this.dragState.hasDragStarted) {
      this.target=this.dragHandler.onDragStart(evt,this.dragState!,this,onUpdateState);
      this.dragState={...this.dragState!, target:this.target,hasDragStarted:true};
      this.dragState.hasDragStarted=true;
      this.onDragStateChanged(this.dragState)
    }

  }
  onClick(onUpdateState:any,evt:MouseEvent) {
    if(this.dragHandler?.onClick) {
      this.dragHandler.onClick(evt,this.target,onUpdateState)
      }
    
  }
  onMouseMove(onUpdateState:any,evt:MouseEvent) {
    
    if(this.dragHandler?.onMouseMove) {
      this.dragHandler.onMouseMove(evt,this.target,onUpdateState)
      }
    if(!this.dragState?.isDragging) {
      return;
    }
    var currentPoint:Point=[evt.clientX,evt.clientY]
    var delta=VectorUtils.subtract(currentPoint,this.dragState!.end)
    this.dragState = {
      target:this.target,
      delta,
      totalDelta:VectorUtils.add(this.dragState!.totalDelta,delta),
      start:this.dragState!.start,
      end:currentPoint,
      isDragging:true,
      hasDragStarted:true
    }
    this.target=this.dragHandler.onDrag(evt,this.dragState,onUpdateState);
    this.dragState={...this.dragState, target:this.target};
    this.onDragStateChanged(this.dragState)
  }
  onMouseUp(onUpdateState:any,evt:MouseEvent) {
    // window.removeEventListener("mousemove",this.mouseMoveListener);
    // window.removeEventListener("mouseup",this.mouseUpListener);
    const dragState : DragState<T> = {
      target:this.target,
      delta:[0,0],
      totalDelta:this.dragState!.totalDelta,
      start:this.dragState!.start,
      end:[evt.clientX,evt.clientY],
      isDragging:false,
      hasDragStarted:false
    }
    
    this.dragState=null;
    this.dragHandler.onDragEnd(evt,dragState,onUpdateState)
    this.onDragStateChanged(this.dragState)
  }

 
}

