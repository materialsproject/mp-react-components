import React, { useState } from 'react';
import { scene, scene2 } from '../components/crystal-toolkit/scene/mike';
import { s2, s3, s4 } from '../components/crystal-toolkit/scene/simple-scene';
import { CameraContextWrapper } from '../components/crystal-toolkit/Simple3DScene/camera-context';
import { AnimationStyle, Renderer } from '../components/crystal-toolkit/Simple3DScene/constants';
import Simple3DSceneComponent from '../components/crystal-toolkit/Simple3DScene/Simple3DSceneComponent.react';
import { ExportType } from '../components/crystal-toolkit/Simple3DScene/constants';

/**
 * Component for testing Simple3DScene
 */

const vis = { atoms: true };

function SceneSwitcher() {
  const [_scene, setScene] = useState(s2) as any;
  const [_vis, setVisibility] = useState(vis) as any;
  const [_anim, setAnim] = useState(AnimationStyle.NONE) as any;

  return (
    <div>
      <div onClick={() => setScene(s2)}> SCENE A </div>
      <div onClick={() => setScene(s3)}> SCENE B </div>
      <div onClick={() => setScene(s4)}> SCENE C </div>
      <div onClick={() => setScene(scene)}> SCENE D </div>
      <div onClick={() => setAnim(AnimationStyle.PLAY)}> PLAY </div>
      <div onClick={() => setAnim(AnimationStyle.NONE)}> NONE </div>
      <div onClick={() => setAnim(AnimationStyle.SLIDER)}> SLIDER </div>
      <div
        onClick={() => {
          vis.atoms = !vis.atoms;
          setVisibility({ ...vis });
        }}
      >
        {' '}
        TOGGLE VIS{' '}
      </div>
      <Simple3DSceneComponent
        sceneSize={'30vw'}
        animation={_anim}
        settings={{
          staticScene: false,
          renderer: Renderer.WEBGL,
          extractAxis: false,
          isMultiSelectionEnabled: true,
          secondaryObjectView: true,
        }}
        data={_scene}
        debug={true}
        toggleVisibility={_vis}
      />
    </div>
  );
}

export const CrystalStructureViewer: React.FC = () => {
  return (
    <div>
      <Simple3DSceneComponent
        settings={{
          renderer: Renderer.WEBGL,
          extractAxis: false,
          zoomToFit2D: true,
        }}
        data={scene}
        debug={false}
        toggleVisibility={{}}
        downloadRequest={{
          n_requests: 1,
          filename: 'test',
          filetype: ExportType.png,
        }}
      />
      {/* <CameraContextWrapper>
        <SceneSwitcher />
        <>
          <Simple3DSceneComponent
            settings={{ renderer: Renderer.WEBGL, extractAxis: false }}
            data={scene}
            debug={true}
            toggleVisibility={{}}
          />
          <Simple3DSceneComponent
            settings={{ renderer: Renderer.WEBGL, extractAxis: true }}
            data={scene2}
            debug={false}
            toggleVisibility={{}}
          />
        </>
      </CameraContextWrapper> */}
    </div>
  );
};
