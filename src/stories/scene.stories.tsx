import { boolean, number, object, select, withKnobs } from '@storybook/addon-knobs';
import * as React from 'react';
import {
  s2,
  s2 as sceneJson,
  shperes as sceneJson2
} from '../components/crystal-toolkit/scene/simple-scene';
import JSONViewComponent from '../components/crystal-toolkit/JSONViewComponent.react';
import Simple3DSceneComponent from '../components/crystal-toolkit/Simple3DScene/Simple3DSceneComponent.react';
import ReactGraphComponent from '../components/crystal-toolkit/graph.component';
import { CameraContextWrapper } from '../components/crystal-toolkit/Simple3DScene/camera-context';
import { ScenePosition } from '../components/crystal-toolkit/scene/inset-helper';
import { AnimationStyle, Renderer } from '../components/crystal-toolkit/Simple3DScene/constants';
import { DEFAULT_OPTIONS, GRAPH } from './constants';
import { bezierScene } from '../components/crystal-toolkit/Simple3DScene/bezier-scene';

const emptyObject = {};
export const scene3d = () => (
  <>
    This component renders a 3D scene by using the provided JSON.
    <div>
      <Simple3DSceneComponent
        debug={boolean('DEBUG', false)}
        animation={select(
          'Animation',
          [AnimationStyle.SLIDER, AnimationStyle.PLAY, AnimationStyle.NONE] as string[],
          AnimationStyle.NONE as string
        )}
        axisView={select('Axis position', ['SW', 'SE', 'NW', 'NE', 'HIDDEN'], 'SW')}
        inletPadding={number('padding', 10)}
        inletSize={number('size', 100)}
        data={object('scene', sceneJson)}
        sceneSize={object('Size', 400)}
        toggleVisibility={emptyObject}
      />
    </div>
    You can link the camera of multiple scene together
    <CameraContextWrapper>
      <>
        <Simple3DSceneComponent
          axisView={ScenePosition.HIDDEN}
          sceneSize={150}
          data={sceneJson2}
        ></Simple3DSceneComponent>
        <Simple3DSceneComponent
          axisView={ScenePosition.HIDDEN}
          sceneSize={150}
          data={sceneJson}
        ></Simple3DSceneComponent>
      </>
    </CameraContextWrapper>
  </>
);

export const jsonView = () => (
  <>
    <div> A component to view/edit JSON </div>
    <JSONViewComponent src={{ a: { b: { c: { d: '12' } } } }} />
  </>
);

export const graphVizView = () => (
  <>
    <div> A component to view force directed graph </div>
    <ReactGraphComponent
      graph={object('scene', GRAPH)}
      options={object('options', DEFAULT_OPTIONS)}
    ></ReactGraphComponent>
  </>
);

export const animatedScene = () => (
  <Simple3DSceneComponent
    sceneSize={'30vw'}
    animation={AnimationStyle.PLAY}
    settings={{
      staticScene: false,
      renderer: Renderer.WEBGL,
      extractAxis: false,
      isMultiSelectionEnabled: false,
      secondaryObjectView: true
    }}
    data={s2}
    debug={false}
  />
);

export const tubeScene = () => (
  <>
    Use the <code>Bezier</code> type to create a tube made of two extruded bezier curves. Each tube
    is divided in two bezier curves. Each curve has three control points, but as the last control
    point of the first is the same as the first control point of the last control, we only have five
    control points for a bezier tube. Similarly, each curve has its own start radius and end radius,
    but as the intermediate radius is shared, the radius only has three elements. Finally, each
    curve has its own color.
    <Simple3DSceneComponent
      sceneSize={'30vw'}
      animation={AnimationStyle.NONE}
      settings={{
        staticScene: true,
        renderer: Renderer.WEBGL,
        extractAxis: false,
        isMultiSelectionEnabled: false,
        secondaryObjectView: true
      }}
      data={object('scene', bezierScene)}
      debug={false}
    />
  </>
);

export default {
  component: Simple3DSceneComponent,
  title: 'Crystal-toolkit',
  decorators: [withKnobs],
  stories: []
};
