import React from 'react';
import { Rectangle } from '../../../utils/math/geometry/Rectangle';
import { Point } from '../../../utils/math/Point';
import { Tool } from '../../../models/tools/Tool';
import { RenderableObject } from '../RenderableObject';
import { AbstractRenderableObject, RenderObjectOptions } from './AbstractRenderableObject';

interface TextObjectProps extends RenderObjectOptions {
  size?: number;
  text: string;
  offset?: Point;
}
export class TextObject extends AbstractRenderableObject implements RenderableObject {
  private size: number;
  private text: string;
  constructor(options: TextObjectProps) {
    const { text, size = 12, fill, offset = [0, 0] } = options;
    super(offset, { ...options, fill: fill || 'black' });

    this.size = size;
    this.text = text;
  }
  getTypeId(): string {
    return 'builtin:text';
  }

  getVersion(): number {
    return 1;
  }
  computeBoundingRect(): Rectangle {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '0px';
    svg.style.height = '0px';
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    path.setAttribute('dominant-baseline', 'hanging');
    path.setAttribute('style', `font-size:${this.size}px`);
    path.appendChild(document.createTextNode(this.text));
    path.setAttribute('transform', `rotate(${this.rotation})`);
    svg.appendChild(path);
    document.body.appendChild(svg);
    const box = (svg as unknown as SVGSVGElement).getBBox();

    document.body.removeChild(svg);

    return new Rectangle([box.x, box.y], [box.width, box.height]); // i think this is coused by dominant baseline
  }

  render(): JSX.Element {
    return (
      <text dominantBaseline={'hanging'} style={{ fontSize: this.size }} fill={this.fill}>
        {this.text}
      </text>
    );
  }
  canApplyTool(tool: Tool<any>): boolean {
    return false;
  }
}
