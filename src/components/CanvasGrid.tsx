import React, { useState } from 'react';
import { Settings } from '../models/Settings';
import { Dimension } from '../utils/math/Dimension';
import { Point } from '../utils/math/Point';
import styles from './CanvasGrid.modules.css';

interface CanvasGridProps {
  size: Dimension;
  location: Point;
  settings: Settings;
  labels?: boolean;
  scale?: number;
  labelSpace?: number;
}

interface GridlinesProps {
  majorSpacing?: number;
  minorSpacing?: number;
  labels: boolean;
  labelSpace: number;
  scale: number;
  start: number;
  startY: number;
  end: number;
  length: number;
  horizontal?: boolean;
}

const MajorGridlines = (props: any) => {
  const {
    start,
    spacing,
    labels,
    labelSpace,
    scale,
    length,
    end,
    horizontal,
    minor,
    minorLines = 2,
    startY,
  } = props;
  if (!spacing) {
    return null;
  }
  const lines = [];
  const labelEls: any[] = [];

  const lineSpacing = minor ? spacing / minorLines : spacing;
  const startPosition =
    start % spacing === 0 ? start : (Math.floor(start / lineSpacing) + 1) * lineSpacing;
  const shouldRenderLabel = (val: number) =>
    labels && !minor && (!horizontal || val > 0) && (val / scale) % labelSpace === 0;
  for (let pos = startPosition; pos <= startPosition + end + lineSpacing; pos += lineSpacing) {
    if (minor && pos % spacing === 0) {
      continue;
    }

    if (horizontal) {
      lines.push({ y1: pos, y2: pos, x1: startY, x2: startY + length + lineSpacing });
    } else {
      lines.push({ x1: pos, x2: pos, y1: startY, y2: startY + length + lineSpacing });
    }
    if (shouldRenderLabel(pos)) {
      labelEls.push({
        value: pos / scale,
        x: horizontal ? startY : pos,
        y: !horizontal ? startY : pos,
        horizontal,
      });
    }
  }
  const className = minor ? styles.minorGridline : styles.majorGridline;
  return (
    <g>
      {lines.map((line) => (
        <line
          key={`${line.x1} ${line.y1}`}
          className={className}
          x1={line.x1}
          x2={line.x2}
          y1={line.y1}
          y2={line.y2}
        />
      ))}
      {labelEls.map((label) => (
        <text
          style={{ fontSize: spacing / 2 }}
          key={`${label.x} ${label.y}`}
          className={className}
          x={label.x}
          y={label.y}
          dominantBaseline={label.horizontal ? 'middle' : 'hanging'}
          textAnchor={label.value > 0 && !label.horizontal ? 'middle' : 'start'}
        >
          {label.value}
        </text>
      ))}
    </g>
  );
};

const Gridlines = (props: GridlinesProps) => {
  return (
    <g>
      <MajorGridlines {...props} spacing={props.majorSpacing} />
      <MajorGridlines
        minor
        {...props}
        spacing={props.majorSpacing}
        minorLines={props.minorSpacing}
      />
    </g>
  );
};

const CanvasGrid = (props: CanvasGridProps) => {
  const { labels = false, scale = 1, labelSpace = 1 } = props;
  const [x, y] = props.location;
  const [width, height] = props.size;
  const { majorGridlines, minorGridlines } = props.settings;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} className={styles.gridBackground} />
      <Gridlines
        majorSpacing={majorGridlines}
        minorSpacing={minorGridlines}
        start={x}
        end={width}
        startY={y}
        length={height}
        labels={labels}
        labelSpace={labelSpace}
        scale={scale}
      />
      <Gridlines
        majorSpacing={majorGridlines}
        minorSpacing={minorGridlines}
        horizontal
        start={y}
        end={height}
        startY={x}
        length={width}
        labels={labels}
        scale={scale}
        labelSpace={labelSpace}
      />
    </g>
  );
};

export default CanvasGrid;
