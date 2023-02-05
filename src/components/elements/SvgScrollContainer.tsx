import React, { useRef, useEffect, useState } from 'react';
import { DragEvents, DragState, DragHandler } from '../../utils/DragState';
enum ScrollType {
  horizontal,
  vertical,
}
class ScrollBarHandler implements DragEvents<null> {
  private maxScroll: number;
  private minScroll: number;
  private scroll: number;
  private setScroll: any;
  private scrollType: ScrollType;
  constructor(
    scroll: number,
    setScroll: any,
    scrollType: ScrollType,
    maxScroll: number,
    minScroll: number = 0
  ) {
    this.scroll = scroll;
    this.setScroll = setScroll;
    this.maxScroll = maxScroll;
    this.minScroll = minScroll;
    this.scrollType = scrollType;
  }
  onDragEnd(evt: MouseEvent, dragState: DragState<null>): void {}
  onDrag(evt: MouseEvent, dragState: DragState<null>) {
    const newScroll =
      this.scroll + dragState.delta[this.scrollType === ScrollType.vertical ? 1 : 0];
    this.scroll = newScroll;
    this.setScroll(Math.max(Math.min(this.maxScroll, newScroll), this.minScroll));
    return null;
  }
  onDragStart(evt: MouseEvent, dragState: DragState<null>): null {
    return null;
  }
}
export const SvgScrollContainer = (props: {
  width: number;
  height: number;
  x: number;
  y: number;
  children: any;
  [x: string]: any;
}) => {
  const { width, height, x, y, children } = props;
  const window = useRef(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [vscroll, setVScroll] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [hscroll, setHScroll] = useState(0);
  const maxVScroll = scrollHeight - height;
  const maxHScroll = scrollWidth - width;
  useEffect(() => {
    var rect = (window.current as any).getBBox();
    setScrollHeight(rect.height);
  }, []);
  const needsVScrollBar = scrollHeight > height;
  const needsHScrollBar = scrollWidth > width;
  const contentWidth = needsVScrollBar ? width - 10 : width;
  const contentHeight = needsHScrollBar ? height - 10 : height;
  const vScrollHandler = new ScrollBarHandler(
    vscroll,
    setVScroll,
    ScrollType.vertical,
    maxVScroll,
    0
  );
  const hScrollHandler = new ScrollBarHandler(
    hscroll,
    setHScroll,
    ScrollType.horizontal,
    maxHScroll,
    0
  );

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      style={{ overflow: 'hiddden' }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g style={{ transform: `translate(${-1 * hscroll}px, ${-1 * vscroll}px)` }}>
        <svg width={contentWidth} height={contentHeight} style={{ overflow: 'visible' }}>
          <g ref={window}>{children}</g>
        </svg>
      </g>
      {needsVScrollBar && (
        <svg x={width - 10} y={vscroll} width={10} height={contentHeight}>
          <rect
            {...new DragHandler(vScrollHandler, null).events}
            data-max-scroll={maxVScroll}
            fill="rgba(0,0,0,.5)"
            width={10}
            height={contentHeight - maxVScroll}
          ></rect>
        </svg>
      )}
      {needsHScrollBar && (
        <svg y={height - 10} x={hscroll} width={contentWidth} height={10}>
          <rect
            {...new DragHandler(hScrollHandler, null).events}
            fill="rgba(0,0,0,.5)"
            width={contentWidth - maxHScroll}
            height={10}
          ></rect>
        </svg>
      )}
    </svg>
  );
};
