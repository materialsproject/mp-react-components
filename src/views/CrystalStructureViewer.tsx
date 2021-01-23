import React, { useEffect, useState } from 'react';
import { scene, scene2 } from '../components/crystal-toolkit/scene/mike';
import { s2, s3, s4, shperes } from '../components/crystal-toolkit/scene/simple-scene';
import { CameraContextProvider } from '../components/crystal-toolkit/CameraContextProvider';
import { AnimationStyle, Renderer } from '../components/crystal-toolkit/scene/constants';
import { CrystalToolkitScene } from '../components/crystal-toolkit/CrystalToolkitScene/CrystalToolkitScene';
import { ExportType } from '../components/crystal-toolkit/scene/constants';
import { Download } from '../components/crystal-toolkit/Download';
import { ScenePosition } from '../components/crystal-toolkit/scene/inset-helper';
import { CameraState } from '../components/crystal-toolkit/CameraContextProvider/camera-reducer';
import * as THREE from 'three';
import { Camera } from 'three';
import { TwoWayInput } from '../components/crystal-toolkit/CrystalToolkitScene/TwoWayInput';

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
  const [dataInput, setDataInput] = useState<any>();

  const cameraState1: CameraState = {
    quaternion: new THREE.Quaternion(
      -0.3824241795060149,
      -0.008442802938742472,
      0.0004401494693141228,
      0.9239481978315308
    ),
    position: new THREE.Vector3(-0.25682715953384966, 11.387372804441647, 11.398460914084055),
    zoom: 4,
    setByComponentId: '1',
    following: true,
  };

  const cameraState2: CameraState = {
    quaternion: new THREE.Quaternion(
      0.024653779710988616,
      -0.08400795009836932,
      -0.18017488693493414,
      0.9797305066109842
    ),
    position: new THREE.Vector3(-2.7956984323728205, -0.29063127398876126, 15.867032946487644),
    zoom: 2.4640147374718713,
    setByComponentId: '1',
    following: true,
  };

  const [state, setState] = useState<any>({
    imageData: undefined,
    imageRequest: undefined,
    imageDataTimestamp: undefined,
    currentCameraState: undefined,
    initialCameraState: cameraState2,
  });

  const [stateTwo, setStateTwo] = useState<any>({
    imageData: undefined,
    imageRequest: undefined,
    imageDataTimestamp: undefined,
    currentCameraState: undefined,
    initialCameraState: cameraState2,
  });

  const [value, setValue] = useState<any>('test');

  useEffect(() => {
    if (state.imageData) {
      setDataInput({
        filename: 'crystal',
        content: state.imageData,
        mimeType: 'image/png',
        isDataURL: true,
      });
    }
  }, [state.imageDataTimestamp]);

  // useEffect(() => {
  //   if (state.cameraState) {
  //     console.log(state.cameraState);
  //   }
  // }, [state.cameraState]);

  return (
    <div>
      <button
        onClick={() => {
          const imageRequest = { filetype: 'png' };
          setState({ ...state, imageRequest });
        }}
      >
        Download
      </button>
      <button
        onClick={() => {
          setState({ ...state, initialCameraState: cameraState1 });
        }}
      >
        Camera 1
      </button>
      <button
        onClick={() => {
          setState({ ...state, initialCameraState: cameraState2 });
        }}
      >
        Camera 2
      </button>
      <button
        onClick={() => {
          setValue('tacos');
        }}
      >
        Input 1
      </button>
      <TwoWayInput value={value} setValue={setValue} />
      <p>{value}</p>
      <CameraContextProvider>
        <>
          <CrystalToolkitScene
            settings={{
              renderer: Renderer.WEBGL,
              extractAxis: false,
              zoomToFit2D: true,
            }}
            data={scene}
            debug={false}
            toggleVisibility={{}}
            imageRequest={state.imageRequest}
            imageData={state.imageData}
            imageDataTimestamp={state.imageDataTimestamp}
            currentCameraState={state.currentCameraState}
            initialCameraState={state.initialCameraState}
            setProps={setState}
          />
          <CrystalToolkitScene
            settings={{
              renderer: Renderer.WEBGL,
              extractAxis: false,
              zoomToFit2D: true,
            }}
            data={scene}
            setProps={setStateTwo}
          />
        </>
      </CameraContextProvider>
      <p>Parent Current Camera State:</p>
      <p>{state.currentCameraState?.position?.x}</p>
      <Download id="image-download" data={dataInput} />
      {/* <CameraContextProvider>
        <>
          <CrystalToolkitScene
            // axisView={ScenePosition.HIDDEN}
            sceneSize={150}
            data={s2}
            setProps={setState}
          ></CrystalToolkitScene>
          <CrystalToolkitScene
            // axisView={ScenePosition.HIDDEN}
            sceneSize={150}
            data={shperes}
            setProps={setStateTwo}
          ></CrystalToolkitScene>
        </>
      </CameraContextProvider> */}
      {/* <CameraContextProvider>
        <SceneSwitcher />
      </CameraContextProvider> */}
      {/* <SceneSwitcher /> */}
    </div>
  );
};
