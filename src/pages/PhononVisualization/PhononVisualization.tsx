import React, { useEffect, useState } from 'react';
import { scene, scene2 } from '../../components/crystal-toolkit/scene/mike';
import {
  s2,
  s3,
  s4,
  s5,
  shperes,
  crystalScene
} from '../../components/crystal-toolkit/scene/simple-scene';
import { CameraContextProvider } from '../../components/crystal-toolkit/CameraContextProvider';
import { AnimationStyle, Renderer } from '../../components/crystal-toolkit/scene/constants';
import { CrystalToolkitScene } from '../../components/crystal-toolkit/CrystalToolkitScene/CrystalToolkitScene';
import { ExportType } from '../../components/crystal-toolkit/scene/constants';
import { Download } from '../../components/crystal-toolkit/Download';
import { ScenePosition } from '../../components/crystal-toolkit/scene/inset-helper';
import { CameraState } from '../../components/crystal-toolkit/CameraContextProvider/camera-reducer';
import * as THREE from 'three';
import { Camera } from 'three';
import SimpleSlider from '../../components/crystal-toolkit/scene/animation-slider';
import { useRef } from 'react';

export const PhononVisualization: React.FC = () => {
  const [dataInput, setDataInput] = useState<any>();
  const [structureContainerWidth, setStructureContainerWidth] = useState('100%');
  const structureContainer = useRef(null);

  const [value, setValue] = useState<any>('test');

  const [tilingX, setTilingX] = useState<any>(2);
  const [tilingY, setTilingY] = useState<any>(1);
  const [tilingZ, setTilingZ] = useState<any>(0);
  const maxTiling: number = 3;

  return (
    <div>
      {/*perhaps add tiling variable to CrystalToolkitScene*/}
      <CrystalToolkitScene
        settings={{
          renderer: Renderer.WEBGL,
          extractAxis: false,
          zoomToFit2D: true
        }}
        data={crystalScene}
        tiling={[tilingX, tilingY, tilingZ]}
        maxTiling={maxTiling}
        sceneSize="100%"
        debug={true}
        toggleVisibility={{}}
      />
      {/* X slider*/}
      <SimpleSlider
        onUpdate={(a) => {
          if (a != tilingX) {
            setTilingX(a);
          }
        }}
        onChange={(a) => {
          console.log(a);
        }}
        domain={[0, maxTiling]}
        values={[tilingX]}
      />
      {/* Y slider*/}
      <SimpleSlider
        onUpdate={(a) => {
          if (a != tilingX) {
            setTilingY(a);
          }
        }}
        onChange={(a) => {
          console.log(a);
        }}
        domain={[0, maxTiling]}
        values={[tilingY]}
      />
      {/* Z slider */}
      <SimpleSlider
        onUpdate={(a) => {
          if (a != tilingX) {
            setTilingZ(a);
          }
        }}
        onChange={(a) => {
          console.log(a);
        }}
        domain={[0, maxTiling]}
        values={[tilingZ]}
      />
    </div>
  );
};
