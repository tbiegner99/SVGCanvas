import React from 'react';
import {v4} from "uuid"
import { Dimension } from '../../utils/math/Dimension';
import { Circle } from '../../utils/math/geometry/Circle';
import { Rectangle } from '../../utils/math/geometry/Rectangle';
import { Point } from '../../utils/math/Point';
import VectorUtils from '../../utils/math/VectorUtils';
import { Tool } from '../../components/tools/Tool';
export const feet=(feet:number)=> feet*12

export interface RenderableObjectFactory {
  getRenderObject(location:Point):RenderableObject;
  canDropObjectOn(object?:RenderableObject):boolean;
}

export interface RenderableObject {
  render(): JSX.Element;
  getId(): string;
  move(point: Point): void;
  getLocation(): Point;
  getBoundingRectangle(): Rectangle;
  isMovable():boolean;
  canApplyTool(tool: Tool<any>): boolean;
}

interface PathComponent {
  buildPathString() : string;
}

export class PathLine implements PathComponent {
  private dx:number;
  private dy:number;
  constructor(dx:number,dy:number) {
    this.dx=dx;
    this.dy=dy;
  }
  buildPathString(): string {
    return `l ${this.dx} ${this.dy}`
  }
  static diagonal(length:number) :PathLine {
    return new PathLine(length,length)
  }
  static horizontal(length:number) :PathLine {
    return new PathLine(length,0)
  }
  static vertical(length:number) :PathLine {
    return new PathLine(0,length)
  }
}
export enum ArcSweep {
  inward=1,
  outward=0
}
export class PathArc implements PathComponent {
  private radius:Dimension;
  private endPoint:Point;
  private sweepFlag:ArcSweep;
  private  rotation:number
  private  largeSweepFlag:number
   constructor(endPoint:Point, radius:Dimension,sweepFlag:ArcSweep,rotation:number=0,largeSweepFlag:number=0) {
    this.radius=radius;
    this.endPoint=endPoint;
    this.sweepFlag=sweepFlag;
    this.rotation=rotation;
    this.largeSweepFlag=largeSweepFlag;
  }
  buildPathString(): string {
    return `a ${this.radius[0]} ${this.radius[1]} ${this.rotation} ${this.largeSweepFlag} ${this.sweepFlag} ${this.endPoint[0]} ${this.endPoint[1]}`
  }
  static circular(endPoint:Point, curveRadius:number, sweepFlag:ArcSweep) :PathArc {
    return new PathArc(endPoint,[curveRadius,curveRadius],sweepFlag)
  }
  static eliptical(endPoint:Point, rx:number,ry:number, sweepFlag:ArcSweep,rotation:number=0) :PathArc {
    return new PathArc(endPoint,[rx,ry],sweepFlag,rotation)
  }
}

export class Path implements RenderableObject {
  private offset:Point;
  private components:PathComponent[];
  private fill: string | undefined;
  private stroke: any;
  private start: Point;
  private id: string;
  constructor(offset:Point,components:PathComponent[], options:{fill?:string,stroke?:string, start?:Point}={}) {
    const {fill,stroke, start=[0,0]} = options;
    this.start = start;
    this.fill=fill;
    this.stroke=stroke;
    this.offset=offset;
    this.components=components
    this.id=v4()

  }
  isMovable(): boolean {
    return true;
  }
  render(): JSX.Element {
      return <path strokeWidth={.5} fill={this.fill} stroke={this.stroke} d={this.buildPath()}/>
  }
  getId(): string {
    return this.id;
  }
  move(point: Point): void {
    this.offset=VectorUtils.add(point,this.offset)
  }
  getLocation(): Point {
   return  this.offset;
  }
  getBoundingRectangle(): Rectangle {
    const svg=document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width="0px";
    svg.style.height="0px";
    const path=document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute("d",this.buildPath());
    svg.appendChild(path);
   document.body.appendChild(svg);
    const box=(path as unknown as SVGSVGElement).getBBox();
   document.body.removeChild(svg);
    return new Rectangle(this.offset,[box.width,box.height])
    
  }
  canApplyTool(tool: Tool<any>): boolean {
    return true;
  }
  buildPath() :string{
    return `M ${this.start[0]} ${this.start[1]} `+this.components.map(c=>c.buildPathString()).join(" ");
  }
}

export class Shape extends Path {
  buildPath() {
    return super.buildPath()+" Z";
  }
}

export class GardenMap extends Shape {

  constructor(offset: Point = [0, 0], fill: string = 'rgba(255,0,0,.6)',stroke = 'black') {
    super(offset,[
      PathLine.horizontal(feet(29)),
      PathLine.vertical(feet(2)),
       PathArc.circular([feet(-1),feet(1)],feet(1),ArcSweep.inward),
      PathLine.horizontal(feet(-6)),
      PathArc.circular([feet(-1),feet(1)],feet(1),ArcSweep.outward),
      PathLine.vertical(feet(10)),
      PathLine.horizontal(feet(-2)),
      PathLine.vertical(feet(-10)),
      PathArc.circular([feet(-1),feet(-1)],feet(1),ArcSweep.outward),
      PathLine.horizontal(feet(-17)),
      PathArc.circular([feet(-1),feet(-1)],feet(1),ArcSweep.inward),

    ],{fill,stroke})
  }
  isMovable() {return false;}

}

export class TextObject implements RenderableObject {
  private offset: Point;
  private fill: string;
  private size:number;
  private text:string;
  private id: string;
  constructor({text,offset = [0, 0],fill= 'rgba(255,0,0,.6)',size=12}: {
    text:string,
    offset?: Point, 
    fill?: string , 
    size?:number}) {
    this.offset = offset;
    this.size=size;
    this.text=text;
    this.fill = fill;
    this.id=v4()
  }
  isMovable(): boolean {
    return true;
  }


  getId() {
    return this.id;
  }
  move(point: Point): void {
    this.offset = VectorUtils.add(this.offset, point);
  }
  getLocation() {
    return this.offset;
  }
  getBoundingRectangle(): Rectangle {
    const svg=document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width="0px";
    svg.style.height="0px";
    const path=document.createElementNS('http://www.w3.org/2000/svg', 'text');
    path.setAttribute("dominant-baseline","hanging");
    path.setAttribute("style",`font-size:${this.size}`)
    path.appendChild(document.createTextNode(this.text))
    svg.appendChild(path);
   document.body.appendChild(svg);
    const box=(path as unknown as SVGSVGElement).getBBox();
   document.body.removeChild(svg);
    return new Rectangle(this.offset,[box.width,box.height])
  }

  render(): JSX.Element {
    return (
      <text dominantBaseline={"hanging"} style={{fontSize:this.size}} fill={this.fill}>{this.text}</text>
    );
  }
  canApplyTool(tool: Tool<any>): boolean {
    return false
  }
}

export class RenderableCircle extends Circle implements RenderableObject {
  private offset: Point;
  private fill: string;
  private id: string;
  constructor(radius: number, offset: Point = [0, 0], fill: string = 'rgba(255,0,0,.6)') {
    super(radius);
    this.offset = VectorUtils.subtract(offset, [radius, radius]);
    this.fill = fill;
    this.id=v4()
  }
  isMovable(): boolean {
    return true;
  }

  getId() {
    return this.id;
  }
  move(point: Point): void {
    this.offset = VectorUtils.add(this.offset, point);
  }
  getLocation() {
    return this.offset;
  }
  getBoundingRectangle(): Rectangle {
    const rect=Rectangle.createFromPoints(this.offset,
      VectorUtils.add(this.offset, [2*this.radius, 2*this.radius])
    );
    return rect
  }

  render(): JSX.Element {
    return (
      <g>
        <circle
          r={this.radius}
          cx={this.radius}
          cy={this.radius}
          strokeWidth={0.1}
          stroke="black"
          fill={this.fill}
        />
        <circle r={0.5} cx={this.radius} cy={this.radius} stroke="none" fill="black" />
      </g>
    );
  }
  canApplyTool(tool: Tool<any>): boolean {
    throw new Error('Method not implemented.');
  }
}

export class RenderableRectangle extends Rectangle implements RenderableObject {
  private offset: Point;
  private fill: string;
  private id: string;
  constructor(size: Dimension, offset: Point = [0, 0], fill: string = 'rgba(255,0,0,.6)') {
    super([0, 0], size);
    this.offset = offset;
    this.fill = fill;
    this.id=v4()
  }
  isMovable(): boolean {
    return true;
  }
  getId() {
    return this.id;
  }
  move(point: Point): void {
    this.offset = VectorUtils.add(this.offset, point);
  }
  getLocation() {
    return this.offset;
  }
  getBoundingRectangle(): Rectangle {
    return Rectangle.createFromPoints(this.offset, VectorUtils.add(this.offset, this.size));
  }

  render(): JSX.Element {
    return (
      <g>
        <rect
          width={this.size[0]}
          height={this.size[1]}
          fill={this.fill}
          strokeWidth={0.1}
          stroke="black"
        ></rect>
      </g>
    );
  }
  canApplyTool(tool: Tool<any>): boolean {
    throw new Error('Method not implemented.');
  }
}
