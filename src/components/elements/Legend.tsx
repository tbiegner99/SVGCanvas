import React, { useState } from 'react';
import { v4 } from 'uuid';
import { SvgRoundedRectangle } from './SvgRoundedRectangle';
import {
  RenderableObject,
  RenderableObjectFactory,
} from '../../components/objects/RenderableObject';
import { Point } from '../../utils/math/Point';
import { SvgScrollContainer } from './SvgScrollContainer';
import { RenderableRectangle } from '../../components/objects/types/Rectangle';
import { GardenMap } from '../../components/objects/garden/GardenMap';
const generateRandomColor = () => {
  const generateChannel = () => Math.floor(Math.random() * 256);
  return `rgba(${generateChannel()}, ${generateChannel()},${generateChannel()},1)`;
};

export interface LegendOption extends RenderableObjectFactory {
  color: string;
  title: () => string;
  id: () => string;
}
export interface LegendModel {
  getTitle(): string;
  getOptions(): LegendOption[];
}
var options = [
  {
    id: () => v4(),
    color: generateRandomColor(),
    title: () => 'Cayenne 1',
    canCreateObject: () => true,
    onObjectCreated: () => {},
    getRenderObject: function (this, location: Point) {
      return new RenderableRectangle([18, 18], location, { fill: this.color });
    },
    canDropObjectOn: (r: RenderableObject) => r instanceof GardenMap,
  },
  {
    id: () => v4(),
    color: generateRandomColor(),
    title: () => 'Cayenne 2',
    max: 3,
    canCreateObject: function (this) {
      return this.max > 0;
    },
    onObjectCreated: function (this, created: number) {
      this.max = this.max - created;
    },
    getRenderObject: function (this, location: Point) {
      return new RenderableRectangle([24, 24], location, { fill: this.color });
    },
    canDropObjectOn: (r: RenderableObject) => r instanceof GardenMap,
  },
];

export const Legend = ({
  onCreateLegendObject,
}: {
  onCreateLegendObject: (opt: LegendOption) => any;
}) => {
  var model: LegendModel = {
    getTitle: () => 'Plants',
    getOptions: () => options,
  };
  return (
    <svg width="300">
      <SvgRoundedRectangle
        width={300}
        height={210}
        borderRadius={15}
        strokeWidth={2}
        fill="white"
        stroke="black"
      />
      <text
        x={150}
        y={10}
        style={{ fontWeight: 'bold', fontSize: 20 }}
        dominantBaseline="hanging"
        width={300}
        textAnchor="middle"
        fill="black"
      >
        {model.getTitle()}
      </text>
      <SvgScrollContainer y={30} x={0} width={300} height={170}>
        {model.getOptions().map((model, index) => {
          return (
            <g
              onClick={() => {
                if (model.canCreateObject()) {
                  onCreateLegendObject(model);
                }
              }}
              key={model.id()}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={20 + (index % 2) * 150}
                y={Math.floor(index / 2) * 30}
                width={10}
                height={10}
                fill={model.color}
                stroke="black"
                strokeWidth={1}
              ></rect>
              <text
                x={20 + (index % 2) * 150 + 30}
                y={Math.floor(index / 2) * 30}
                dominantBaseline="hanging"
              >
                {model.title()}
              </text>
            </g>
          );
        })}
      </SvgScrollContainer>
    </svg>
  );
};
