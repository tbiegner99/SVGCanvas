import React, {useState} from "react"
import {v4} from "uuid"
import { SvgRoundedRectangle } from "./SvgRoundedRectangle"
import { GardenMap, RenderableObject, RenderableObjectFactory, RenderableRectangle } from "../../components/objects/RenderableObject";
import { Point } from "../../utils/math/Point";
import { SvgScrollContainer } from "./SvgScrollContainer";
const generateRandomColor = ()=>{
    const generateChannel = ()=>Math.floor(Math.random()*256);
    return `rgba(${generateChannel()}, ${generateChannel()},${generateChannel()},1)`
}

export interface LegendOption extends RenderableObjectFactory {
    color?:string;
    title: string;
    id:string;
    supportsDrag:boolean;
   
}
export interface LegendModel {
    getTitle(): string;
    getOptions():LegendOption[]

}
var options=[
    {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne 1",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return  new RenderableRectangle([18,18],location,this.color);},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },
    {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne 2",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([24,24],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },
    {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne 3",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },   {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne4",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },   {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne5",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },   {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne6",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },   {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne7",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },   {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne8",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
    
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap},
    {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne9",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },
    {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne10",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },
    {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne11",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },
    {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne12",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },
    {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },
    {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },
    {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    },
    {
        id:v4(),
        color:generateRandomColor(),
        title:"Cayenne",
        supportsDrag:true,
        getRenderObject:function(this,location:Point){return new RenderableRectangle([18,18],location,this.color)},
        canDropObjectOn:(r:RenderableObject) =>r instanceof GardenMap
    }
]

export const Legend =({onCreateLegendObject}:{onCreateLegendObject:(opt:LegendOption)=>any})=>{
    var model:LegendModel ={
        getTitle:()=>"Plants",
        getOptions:() =>options}
    return <svg   width="300">
        <SvgRoundedRectangle width={300} height={210} borderRadius={15} strokeWidth={2} fill="white" stroke="black"/>
        <text x={150} y={10} style={{"fontWeight":"bold", "fontSize":20}}  dominantBaseline='hanging' width={300} textAnchor='middle' fill="black">{model.getTitle()}</text>
        <SvgScrollContainer y={30} x={0} width={300} height={170}>
            {model.getOptions().map((model,index)=>{
                return <g onClick={()=>{onCreateLegendObject(model)}} key={model.id} style={{cursor:"pointer"}}>
                    <rect x={20+index%2*150} y={Math.floor(index/2)*30}  width={10} height={10} fill={model.color} stroke="black" strokeWidth={1}></rect>
                    <text x={20+index%2*150+30} y={Math.floor(index/2)*30} dominantBaseline='hanging'>{model.title}</text>
                </g>
            })}
        </SvgScrollContainer>
    </svg>
}