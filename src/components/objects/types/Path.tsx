import React from 'react';
import { Dimension } from '../../../utils/math/Dimension';
import { Point } from '../../../utils/math/Point';
import { RenderableObject } from '../RenderableObject';
import { Rectangle } from '../../../utils/math/geometry/Rectangle';
import { Tool } from '../../../models/tools/Tool';
import { AbstractRenderableObject, RenderObjectOptions } from './AbstractRenderableObject';
interface PathComponent {
  buildPathString(): string;
}

export class PathLine implements PathComponent {
  private dx: number;
  private dy: number;
  constructor(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }
  buildPathString(): string {
    return `l ${this.dx} ${this.dy}`;
  }
  static diagonal(length: number): PathLine {
    return new PathLine(length, length);
  }
  static horizontal(length: number): PathLine {
    return new PathLine(length, 0);
  }
  static vertical(length: number): PathLine {
    return new PathLine(0, length);
  }
}
export enum ArcSweep {
  inward = 1,
  outward = 0,
}
export class PathArc implements PathComponent {
  private radius: Dimension;
  private endPoint: Point;
  private sweepFlag: ArcSweep;
  private rotation: number;
  private largeSweepFlag: number;
  constructor(
    endPoint: Point,
    radius: Dimension,
    sweepFlag: ArcSweep,
    rotation: number = 0,
    largeSweepFlag: number = 0
  ) {
    this.radius = radius;
    this.endPoint = endPoint;
    this.sweepFlag = sweepFlag;
    this.rotation = rotation;
    this.largeSweepFlag = largeSweepFlag;
  }
  buildPathString(): string {
    return `a ${this.radius[0]} ${this.radius[1]} ${this.rotation} ${this.largeSweepFlag} ${this.sweepFlag} ${this.endPoint[0]} ${this.endPoint[1]}`;
  }
  static circular(
    endPoint: Point,
    curveRadius: number,
    sweepFlag: ArcSweep,
    rotation: number = 0,
    largeSweepFlag: number = 0
  ): PathArc {
    return new PathArc(endPoint, [curveRadius, curveRadius], sweepFlag, rotation, largeSweepFlag);
  }
  static eliptical(
    endPoint: Point,
    rx: number,
    ry: number,
    sweepFlag: ArcSweep,
    rotation: number = 0,
    largeSweepFlag: number = 0
  ): PathArc {
    return new PathArc(endPoint, [rx, ry], sweepFlag, rotation, largeSweepFlag);
  }
}

interface PathOptions extends RenderObjectOptions {
  start?: Point;
}

export abstract class Path extends AbstractRenderableObject implements RenderableObject {
  private components: PathComponent[];
  private start: Point;

  constructor(offset: Point, components: PathComponent[], options: PathOptions = {}) {
    super(offset, options);
    const { start = [0, 0] } = options;
    this.start = start;
    this.components = components;
  }

  getTypeId(): string {
    return 'builtin:path';
  }

  getVersion(): number {
    return 1;
  }

  isSelectable(): boolean {
    return true;
  }
  isMovable(): boolean {
    return true;
  }
  render(): JSX.Element {
    return (
      <path
        strokeWidth={this.strokeWidth}
        fill={this.fill}
        stroke={this.stroke}
        d={this.buildPath()}
      />
    );
  }

  computeBoundingRect(offset: Point, rotation: number): Rectangle {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.overflow = 'visible';
    svg.style.width = '0px';
    svg.style.height = '0px';
    const transform = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    transform.setAttribute('transform', `rotate(${rotation})`);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', this.buildPath());
    transform.appendChild(path);
    svg.appendChild(transform);
    document.body.appendChild(svg);
    svg.id = 'mock';
    const box = (svg as unknown as SVGSVGElement).getBBox();
    document.body.removeChild(svg);
    // console.log(box);
    return new Rectangle([box.x, box.y], [box.width, box.height]);
  }

  canApplyTool(tool: Tool<any>): boolean {
    return true;
  }
  buildPath(): string {
    return (
      `M ${this.start[0]} ${this.start[1]} ` +
      this.components.map((c) => c.buildPathString()).join(' ')
    );
  }
}
