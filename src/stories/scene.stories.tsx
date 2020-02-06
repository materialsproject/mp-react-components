import Simple3DSceneComponent from "../crystal-toolkit-components/components-v2/Simple3DSceneComponent.react";
import { object, withKnobs } from "@storybook/addon-knobs";
import * as React from "react";
import { scene  as sceneJson} from "../crystal-toolkit-components/components-v2/scene/simple-scene";

export const scene3d = () => <>
  This component renders a 3D scene by using the provided JSON.
  You are responsible for providing a container that has a defined size.

  <div style={{width: '500px', height: '500px'}}>
    <Simple3DSceneComponent data={ object('scene', sceneJson)} toggleVisibility={{}}/>
  </div>
</>;


export default {
  component: Simple3DSceneComponent,
  title: 'Scene',
  decorators: [withKnobs],
  stories: []
};
