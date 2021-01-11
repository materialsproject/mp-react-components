import React, { useState } from 'react';
import { scene, scene2 } from '../components/crystal-toolkit/scene/mike';
import { s2, s3, s4 } from '../components/crystal-toolkit/scene/simple-scene';
import { CameraContextProvider } from '../components/crystal-toolkit/CameraContextProvider';
import { AnimationStyle, Renderer } from '../components/crystal-toolkit/scene/constants';
import { CrystalToolkitScene } from '../components/crystal-toolkit/CrystalToolkitScene/CrystalToolkitScene';
import { ExportType } from '../components/crystal-toolkit/scene/constants';

/**
 * Component for testing Scene
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
      <CrystalToolkitScene
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
      <CrystalToolkitScene
        settings={{
          renderer: Renderer.WEBGL,
          extractAxis: false,
          zoomToFit2D: true,
        }}
        data={scene}
        debug={false}
        toggleVisibility={{}}
        imageRequest={{
          n_requests: 1,
          filename: 'test',
          filetype: ExportType.png,
        }}
      />
      {/* <CameraContextProvider>
        <SceneSwitcher />
        <>
          <CrystalToolkitScene
            settings={{ renderer: Renderer.WEBGL, extractAxis: false }}
            data={scene}
            debug={true}
            toggleVisibility={{}}
          />
          <CrystalToolkitScene
            settings={{ renderer: Renderer.WEBGL, extractAxis: true }}
            data={scene2}
            debug={false}
            toggleVisibility={{}}
          />
        </>
      </CameraContextProvider> */}
    </div>
  );
};
