import React from 'react';
import { Dimension } from '../../../utils/math/Dimension';
import { Rectangle } from '../../../utils/math/geometry/Rectangle';
import { Point } from '../../../utils/math/Point';
import { Tool } from '../../../models/tools/Tool';
import { RenderableObject } from '../RenderableObject';
import { AbstractRenderableObject, RenderObjectOptions } from './AbstractRenderableObject';

export class RenderableRectangle extends AbstractRenderableObject implements RenderableObject {
  private rect: Rectangle;
  constructor(size: Dimension, offset: Point = [0, 0], options: RenderObjectOptions = {}) {
    const { fill = 'rgba(255,0,0,.6)' } = options;
    super(offset, { ...options, fill });

    this.rect = new Rectangle([0, 0], size);
  }
  get size(): Dimension {
    return this.rect.size;
  }

  getTypeId(): string {
    return 'builtin:rect';
  }

  getVersion(): number {
    return 1;
  }

  computeBoundingRect(offset: Point, rotation: number): Rectangle {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '0px';
    svg.style.height = '0px';
    const transform = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    transform.setAttribute('transform', `rotate(${rotation})`);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    path.setAttribute('width', `${this.rect.size[0]}`);
    path.setAttribute('height', `${this.rect.size[1]}`);
    transform.appendChild(path);
    svg.appendChild(transform);
    document.body.appendChild(svg);
    const box = (svg as unknown as SVGSVGElement).getBBox();
    document.body.removeChild(svg);
    return new Rectangle([box.x, box.y], [box.width, box.height]);
  }

  render(): JSX.Element {
    return (
      <g>
        <rect
          width={this.rect.size[0]}
          height={this.rect.size[1]}
          fill={this.fill}
          strokeWidth={0.1}
          stroke={this.stroke}
        ></rect>
      </g>
    );
  }
  canApplyTool(tool: Tool<any>): boolean {
    return true;
  }
}
