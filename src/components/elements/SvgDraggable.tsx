import React, { useState, useRef, useEffect } from 'react';
import { Point } from '../../utils/math/Point';
import { VectorUtils } from '../../utils/MathFunctions';
export interface DragState {
  start: Point;
  delta: Point;
  totalDelta: Point;
  end: Point;
  isDragging: boolean;
  hasDragStarted: boolean;
}
export interface DragEvents<T> {
  onDragEnd?: (
    evt: MouseEvent,
    state: T,
    dragState: DragState,
    onUpdateState: (newState: T) => any
  ) => void;
  onDrag?: (
    evt: MouseEvent,
    state: T,
    dragState: DragState,
    onUpdateState: (newState: T) => any
  ) => void;
  onDragStart?: (
    evt: MouseEvent,
    state: T,
    dragState: DragState,
    onUpdateState: (newState: T) => any
  ) => void;
  onDragLeave?: (
    evt: MouseEvent,
    state: T,
    dragState: DragState,
    onUpdateState: (newState: T) => any
  ) => void;
  onMouseMove?: (evt: MouseEvent, state: T, onUpdateState: (newState: T) => any) => void;
  onMouseDown?: (evt: MouseEvent, state: T, onUpdateState: (newState: T) => any) => void;
  onClick?: (evt: MouseEvent, state: T, onUpdateState: (newState: T) => any) => void;
}

export interface DraggableProps<T> extends DragEvents<T> {
  state: T;
  onUpdateState: (newState: T) => any;
  [x: string]: any;
}

export function SvgDraggable<T>(props: DraggableProps<T>) {
  const ref = React.useRef(props);
  const {
    onDragEnd,
    onDrag,
    onMouseMove,
    onMouseDown,
    onDragStart,
    onDragLeave,
    onClick,
    state,
    onUpdateState,
    ...otherProps
  } = props;

  const [dragState, _setDragState] = useState<DragState | null>(null);
  const stateRef = useRef(dragState);
  const setDragState = (s: DragState | null) => {
    stateRef.current = s;
    _setDragState(s);
  };

  const rawMouseMove = (evt: MouseEvent) => {
    const { onMouseMove, state, onUpdateState } = ref.current;
    if (onMouseMove) {
      onMouseMove(evt, state, onUpdateState);
    }
  };

  const mouseMove = (evt: MouseEvent) => {
    let dragState = stateRef.current;
    const { onDrag, onMouseMove, state, onUpdateState } = ref.current;

    if (!dragState || !dragState.isDragging) {
      return;
    }

    var currentPoint: Point = [evt.clientX, evt.clientY];
    var delta = VectorUtils.subtract(currentPoint, dragState.end);
    const newDragState = {
      delta,
      totalDelta: VectorUtils.add(dragState!.totalDelta, delta),
      start: dragState!.start,
      end: currentPoint,
      isDragging: true,
      hasDragStarted: true,
    };
    stateRef.current = newDragState;
    setDragState(newDragState);
    if (onDrag) {
      onDrag(evt, state, newDragState, onUpdateState);
    }
  };

  const mouseDown = (evt: MouseEvent) => {
    const { onMouseDown, onDragStart, state, onUpdateState } = ref.current;
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);
    evt.stopPropagation();
    if (onMouseDown) {
      onMouseDown(evt, state, onUpdateState);
    }

    const newDragState = {
      isDragging: true,
      hasDragStarted: true,
      delta: [0, 0] as Point,
      totalDelta: [0, 0] as Point,
      start: [evt.clientX, evt.clientY] as Point,
      end: [evt.clientX, evt.clientY] as Point,
    };
    stateRef.current = newDragState;
    setDragState(newDragState);

    if (onDragStart) {
      onDragStart(evt, state, newDragState, onUpdateState);
    }
  };

  const mouseUp = (evt: MouseEvent) => {
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', mouseUp);
    const { onDragEnd, state, onUpdateState } = ref.current;
    let dragState = stateRef.current;
    if (!dragState || !dragState.isDragging) {
      return;
    }
    const endDragState = {
      delta: [0, 0] as Point,
      totalDelta: dragState!.totalDelta,
      start: dragState!.start,
      end: [evt.clientX, evt.clientY] as Point,
      isDragging: false,
      hasDragStarted: false,
    };
    setDragState(null);
    if (onDragEnd) {
      onDragEnd(evt, state, endDragState, onUpdateState);
    }
  };

  useEffect(() => {
    ref.current = {
      onDragEnd,
      onDrag,
      onMouseMove,
      onMouseDown,
      onDragStart,
      onDragLeave,
      onClick,
      state,
      onUpdateState,
    };
  });
  const click = (evt: MouseEvent) => {
    if (onClick) {
      onClick(evt, state, onUpdateState);
    }
  };

  return (
    <g
      onClick={click as any}
      onMouseDown={mouseDown as any}
      onMouseMove={rawMouseMove as any}
      {...otherProps}
    ></g>
  );
}
