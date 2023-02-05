import { CanvasState } from '../../components/CanvasState';
import React, { MutableRefObject } from 'react';

export interface CanvasStateContext {
  canvasState?: MutableRefObject<CanvasState>;
  setCanvasState: (state: CanvasState) => any;
}
export const CanvasStateContext = React.createContext<CanvasStateContext>({
  canvasState: undefined,
  setCanvasState: () => {},
});
