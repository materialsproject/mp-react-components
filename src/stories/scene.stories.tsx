import { object, withKnobs } from '@storybook/addon-knobs';
import * as React from 'react';
import { scene as sceneJson } from '../crystal-toolkit-components/components-v2/scene/simple-scene';
import { JSONViewComponent } from '../crystal-toolkit-components/components-v2/JSONViewComponent.react';
import Simple3DSceneComponent from '../crystal-toolkit-components/components-v2/Simple3DScene/Simple3DSceneComponent.react';

export const scene3d = () => (
  <>
    This component renders a 3D scene by using the provided JSON. You are responsible for providing
    a container that has a defined size.
    <div style={{ width: '500px', height: '500px' }}>
      <Simple3DSceneComponent data={object('scene', sceneJson)} toggleVisibility={{}} />
    </div>
  </>
);

export const jsonView = () => (
  <>
    <div> A component to view/edit JSON </div>
    <JSONViewComponent src={{ a: { b: { c: { d: '12' } } } }} />
  </>
);

export default {
  component: Simple3DSceneComponent,
  title: 'Crystal-toolkit',
  decorators: [withKnobs],
  stories: []
};
