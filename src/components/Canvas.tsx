import React, { useEffect, useState, useRef } from 'react';
import { Dimension } from '../utils/math/Dimension';
import styles from './Canvas.modules.css';
import CanvasGrid from './CanvasGrid';
import { Viewport } from '../models/Viewport';
import { RenderableObject } from './objects/RenderableObject';
import VectorUtils from '../utils/math/VectorUtils';
import { Legend } from './elements/Legend';
import { CanvasState } from './CanvasState';
import { Point } from '../utils/math/Point';
import { CanvasKeyListener } from '../models/keyListener/CanvasKeyEventListener';
import { EscapeHandler } from '../models/keyListener/handlers/EscapeHandler';
import { MoveCanvasTool } from '../models/tools/canvas/MoveCanvasTool';
import { CanvasDropTool } from '../models/tools/canvas/CanvasDropTool';
import { SelectedObjectNubs } from './elements/SelectedObjectNubs';
import { CanvasStateContext } from '../models/context/CanvasStateContext';
import { CanvasDraggable } from './elements/CanvasDraggable';
import { GardenMap } from './objects/garden/GardenMap';
import { TextObject } from './objects/types/Text';
import { DeleteHandler } from '../models/keyListener/handlers/DeleteHandler';
import {
  MoveDownHandler,
  MoveLeftHandler,
  MoveRightHandler,
  MoveUpHandler,
} from '../models/keyListener/handlers/MoveHandler';
import { ZoomInHandler, ZoomOutHandler } from '../models/keyListener/handlers/ZoomHandler';
import {
  MultipleObjectSelectHandler,
  ObjectSelectHandler,
} from '../models/keyListener/handlers/ObjectSelectHandler';
import { CanvasObject } from './CanvasObject';
import { SideGardenMap } from './objects/garden/SideGardenMap';
import { StrawberriesGardenMap } from './objects/garden/StrawberriesGardenMap';
import { HerbsGardenMap } from './objects/garden/HerbsGarden';
import { FrontSmallGardenMap } from './objects/garden/FrontSmallGarden';
import { FrontLargeGardenMap } from './objects/garden/FrontLargeGarden';
import { BuiltinSerializers } from '../models/serialization/BuiltinSerializers';
import {
  ObjectSerializer,
  RootSerializer,
} from '../models/serialization/RenderableObjectSerializer';
import { SaveHandler } from '../models/keyListener/handlers/SaveHandler';

export const Canvas = (props: {
  fixedObjects: RenderableObject[];
  additionalSerializers?: ObjectSerializer<any>[];
}) => {
  const {
    additionalSerializers = [],
    fixedObjects = [
      new GardenMap([1 * 12, 1 * 12]),
      new SideGardenMap([16 * 12, 1 * 12]),
      new StrawberriesGardenMap([25 * 12, 3 * 12]),
      new HerbsGardenMap([32 * 12, 3 * 12]),
      new FrontSmallGardenMap([32 * 12, 8 * 12]),
      new FrontLargeGardenMap([31 * 12, 13 * 12]),
      new TextObject({
        text: 'SIDE',
        offset: [5 * 12, 6 * 12],
        size: 10,
      }),
      new TextObject({
        text: 'PUTTING GREEN',
        offset: [21 * 12, 11 * 12],
        size: 10,
      }),
      new TextObject({
        text: 'HERBS',
        offset: [34 * 12, 6 * 12],
        size: 10,
      }),
      new TextObject({
        text: 'SMALL FRONT',
        offset: [37 * 12, 10 * 12],
        size: 10,
      }),
      new TextObject({
        text: 'LARGE FRONT',
        offset: [33 * 12, 18 * 12],
        size: 10,
      }),
      new TextObject({
        text: 'GARDEN MAP',
        offset: [16 * 12, 27 * 12],
        size: 22,
      }),
    ],
  } = props;
  const onSave = (objects: any[]) => {
    console.log(objects);
  };
  const initState: CanvasState = {
    options: {
      snap: 3,
    },
    handlers: [],
    viewport: new Viewport([0, 0], 1, [0, 0]),
    createObject: undefined,
    selectedObjectIndicies: [],
    objects: [],
    zoom: 1,
    currentTool: new MoveCanvasTool(),
    canvasSize: [0, 0],
  };
  const serializer = new RootSerializer([...BuiltinSerializers, ...additionalSerializers]);
  const handlers = [
    new EscapeHandler(),
    new DeleteHandler(),
    new MoveDownHandler(),
    new MoveUpHandler(),
    new MoveLeftHandler(),
    new MoveRightHandler(),
    new ZoomInHandler(),
    new ZoomOutHandler(),
    new ObjectSelectHandler(),
    new MultipleObjectSelectHandler(),
    new SaveHandler(onSave, serializer),
  ];
  const [state, _setState] = useState(initState);
  const { zoom, viewport, objects, options } = state;
  const { locationInPixels, baseSize } = viewport;
  const canvas = useRef(null);
  const stateRef = useRef(state);
  const setState = (s: CanvasState) => {
    stateRef.current = s;
    _setState(s);
  };
  const computeViewportSize = (): [Dimension, Dimension] => {
    var rect = (canvas.current as any).getBoundingClientRect();
    var maxSize: Dimension = [rect.width, rect.height];
    var ratio = rect.width / rect.height;
    var allObjects = [...fixedObjects, ...objects];
    var viewportSize: Dimension = [rect.width / 4, rect.height / 4];
    if (allObjects.length > 0) {
      var objectPoints: Point[] = allObjects
        .map((r) =>
          r.getBoundingRectangle().points.map((item) => VectorUtils.add(item, [12, 12] as Point))
        )
        .reduce((val, lastVal) => lastVal.concat(val));
      var maxPoint: Point = VectorUtils.max(...objectPoints);
      viewportSize = VectorUtils.max(maxPoint, Viewport.pointFromPixels(maxSize, 1));
      viewportSize = Viewport.assertAspectRatio(viewportSize, ratio);
    }
    return [viewportSize, maxSize];
  };
  useEffect(() => {
    const obj: any[] = [
      {
        type: 'builtin:rect',
        version: 1,
        location: [33.75, 109.5],
        id: '1d3e3de1-c00d-4b48-875b-0c54f69bbd42',
        zIndex: 0,
        rotation: 0,
        stroke: 'black',
        strokeWidth: 0.1,
        fill: 'rgba(204, 141,92,1)',
        size: [24, 24],
      },
      {
        type: 'builtin:rect',
        version: 1,
        location: [19.5, 72.25],
        id: '2569cb2c-f159-4d54-9e09-a665adef3c89',
        zIndex: 0,
        rotation: 0,
        stroke: 'black',
        strokeWidth: 0.1,
        fill: 'rgba(204, 141,92,1)',
        size: [24, 24],
      },
      {
        type: 'builtin:rect',
        version: 1,
        location: [14.5, 133.25],
        id: '5b8794dc-87b3-4319-bd91-c93f9a89c266',
        zIndex: 0,
        rotation: 0,
        stroke: 'black',
        strokeWidth: 0.1,
        fill: 'rgba(204, 141,92,1)',
        size: [24, 24],
      },
    ];
    const [viewportSize, canvasSize] = computeViewportSize();
    setState({
      ...state,
      objects: obj.map((o) => serializer.deserialize(o)),
      viewport: new Viewport(viewportSize, 1),
      canvasSize,
    });
    const resizeListener = () => {
      const [viewportSize, canvasSize] = computeViewportSize();
      setState({
        ...state,
        viewport: viewport.resizePixels(viewportSize),
        canvasSize,
      });
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  const stateContext: CanvasStateContext = {
    canvasState: stateRef,
    setCanvasState: setState,
  };

  return (
    <CanvasStateContext.Provider value={stateContext}>
      <svg
        {...new CanvasKeyListener(handlers, state, setState).events}
        tabIndex={0}
        ref={canvas}
        className={styles.canvas}
      >
        <CanvasDraggable
          tool={state.currentTool}
          style={{
            transform: `scale(${zoom}) translate(${-1 * locationInPixels[0]}px, ${
              -1 * locationInPixels[1]
            }px)`,
          }}
          onWheel={(evt: any) => {
            const newZoom = Math.max(1, evt.deltaY < 0 ? zoom * 1.1 : zoom / 1.1);
            setState({
              ...state,
              viewport: state.viewport.zoom(newZoom),
              zoom: newZoom,
            });
          }}
        >
          <svg viewBox={`0 0 ${baseSize[0]} ${baseSize[1]}`}>
            <CanvasGrid
              settings={{
                majorGridlines: 12,
                minorGridlines: 4,
              }}
              location={viewport.location}
              size={viewport.size}
              labels={true}
              scale={12}
              labelSpace={1}
            />
            {fixedObjects.map((r, index) => (
              <CanvasObject canvasState={state} renderOptions={{}} object={r} index={index} />
            ))}
            {objects.map((r, index) => (
              <CanvasObject canvasState={state} renderOptions={{}} object={r} index={index} />
            ))}
            {state.createObject && (
              <CanvasObject
                canvasState={state}
                index={null}
                renderOptions={{ canUseTool: false }}
                object={state.createObject}
              />
            )}
            {state.selectedObjectIndicies.map((index) => {
              return (
                <SelectedObjectNubs
                  scale={viewport.scale}
                  object={state.objects[index]}
                  snap={options.snap}
                />
              );
            })}
          </svg>
        </CanvasDraggable>
        <svg x={20} y={state.canvasSize[1] - 250}>
          <Legend
            onCreateLegendObject={(option) => {
              setState({ ...state, currentTool: new CanvasDropTool(option, setState) });
            }}
          />
        </svg>
      </svg>
    </CanvasStateContext.Provider>
  );
};
