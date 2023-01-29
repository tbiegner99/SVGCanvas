import React, {useEffect, useState,useRef} from 'react';
import { Dimension } from '../utils/math/Dimension';
import styles from "./Canvas.modules.css" 
import CanvasGrid from './CanvasGrid';
import { Viewport } from '../models/Viewport' ;
import { DragHandler, DragState } from '../utils/DragState';
import {GardenMap, RenderableCircle, RenderableObject, RenderableRectangle, TextObject} from "./objects/RenderableObject"
import  VectorUtils  from '../utils/math/VectorUtils';
import { Legend } from './elements/Legend';
import { CanvasState } from './CanvasState';
import { Point } from '../utils/math/Point';
import { CanvasKeyListener } from './keyListener/CanvasKeyEventListener';
import { EscapeHandler } from './keyListener/handlers/EscapeHandler';
import { MoveCanvasTool } from './tools/canvas/MoveCanvasTool';
import { CanvasDropTool } from './tools/canvas/CanvasDropTool';
import { SelectedObjectNubs } from './elements/SelectedObjectNubs';
import { CanvasStateContext } from './context/CanvasStateContext';
import { CanvasDraggable } from '../utils/CanvasDraggable';

var handlers =[
    new EscapeHandler()
]

export const Canvas = (props : any) => {
    const initState:CanvasState ={
        options: {
            snap: 3
        },
        viewport: new Viewport([0,0], 1, [0, 0]),
        createObject:undefined,
        selectedObjectIndex:0,
        objects:[
            new GardenMap([1*12,4*12]),
            new RenderableCircle(6,[36,36]),
            new RenderableRectangle([3,3],[18,6]),
           new RenderableCircle(6,[24,24],"rgba(0,255,0,.5)"),
           new TextObject({
            text:"GARDEN MAP"
           })
         ],
         zoom:1,
         currentTool:new MoveCanvasTool(),
         canvasSize:[0,0]
    }
    const [state,_setState] = useState(initState)
    const {zoom,viewport,objects,options} = state;
    const {locationInPixels,baseSize} = viewport
    const canvas=useRef(null);
    const stateRef=useRef(state);
    const setState = (s:CanvasState)=>{
stateRef.current=s;
_setState(s);
    }
    useEffect(()=> {
        var rect = (canvas.current as any).getBoundingClientRect();
        var maxSize:Dimension=[rect.width,rect.height];
        var ratio=rect.width/rect.height;
        var objectPoints:Point[]=objects.map(r=>r.getBoundingRectangle().points.map(item=>VectorUtils.add(item,[12,12] as Point))).reduce((val,lastVal)=>lastVal.concat(val));
        var maxPoint:Point=VectorUtils.max(
            ...objectPoints
        )
        var viewportSize = VectorUtils.max(maxPoint,Viewport.pointFromPixels(maxSize,1))
         viewportSize=Viewport.assertAspectRatio(viewportSize,ratio)
        setState({...state,viewport:new Viewport(viewportSize,1),canvasSize:maxSize});
        const resizeListener = ()=>{
            var rect = (canvas.current as any).getBoundingClientRect();
            var maxSize:Dimension=[rect.width,rect.height];
            var objectPoints=objects.map(r=>r.getBoundingRectangle().points).reduce((val,lastVal)=>lastVal.concat(val));
            var maxPoint:Point=VectorUtils.max(
                ...objectPoints
            )
            setState({...state,viewport:viewport.resizePixels(maxSize),canvasSize:VectorUtils.max(maxSize,maxPoint)});
        }
        window.addEventListener("resize",resizeListener)
        return ()=> {
            window.removeEventListener("resize",resizeListener)
        }
    },[])


    const renderObject = (r:RenderableObject,index:number | null,renderOptions:{canUseTool?:boolean}={})=> {
        if(!viewport.contains(r.getBoundingRectangle())) {
            return null;
        }
        const {canUseTool=true}=renderOptions;
        const location=r.getLocation()
        const snapLocation=options.snap>0?VectorUtils.scalarOperation(location,(el)=>Math.floor(el/options.snap)*options.snap):location;
        const boundedLocation=VectorUtils.max([0,0],snapLocation)
        const objectTool=canUseTool?state.currentTool.getObjectTool(r,index,state):undefined;
    return <svg style={{overflow:'visible', cursor:r.isMovable()?"pointer":"auto",pointerEvents:canUseTool?"all":"none"}} x={boundedLocation[0]} y={boundedLocation[1]} key={r.getId()} >
        <CanvasDraggable tool={objectTool}>
            {r.render()}
            </CanvasDraggable>
        </svg>
}
const stateContext:CanvasStateContext = {
    canvasState:stateRef.current,setCanvasState:setState
}

    return <CanvasStateContext.Provider value={stateContext}><svg {...new CanvasKeyListener(handlers,state,setState).events} tabIndex={0} ref={canvas} className={styles.canvas}>
        <CanvasDraggable tool={state.currentTool} style={{
            transform:`scale(${zoom}) translate(${-1*locationInPixels[0]}px, ${-1*locationInPixels[1]}px)`
        }}   onWheel={(evt:any)=>{
            const newZoom = Math.max(1,evt.deltaY<0?zoom*1.1:zoom/1.1);
            setState({
                ...state,
                viewport:state.viewport.zoom(newZoom),
                zoom:newZoom
            })
        }}><svg   viewBox={`0 0 ${baseSize[0]} ${baseSize[1]}`}>
        <CanvasGrid settings={{
            majorGridlines:12,
            minorGridlines:4
        }} location={viewport.location} size={viewport.size}/>
        {objects.map((r,index)=>renderObject(r,index))}
        {state.createObject && renderObject(state.createObject,null,{canUseTool:false})}
        {typeof state.selectedObjectIndex ==="number" && <SelectedObjectNubs scale={viewport.scale} object={state.objects[state.selectedObjectIndex]} snap={options.snap}/> }
    </svg>
    </CanvasDraggable>
    <svg x={20} y={state.canvasSize[1]-250}>
    <Legend  onCreateLegendObject={(option)=>{
       setState({...state,currentTool:new CanvasDropTool(option,setState)})
        
    }}/>
    </svg>
    
    </svg>
    </CanvasStateContext.Provider>
}
