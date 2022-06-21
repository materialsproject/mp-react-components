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
// import SimpleSlider from '../../components/crystal-toolkit/scene/animation-slider';
import { RangeSlider } from '../../components/data-entry/RangeSlider';
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
        tiling={[tilingX, tilingY, tilingZ]} // TODO: does this need to be broken up?
        maxTiling={maxTiling}
        sceneSize="100%"
        debug={false}
        toggleVisibility={{}}
      />
      {/* TODO: consider creating triple slider component*/}
      {/* X slider*/}
      <RangeSlider
        domain={[0, maxTiling || 1]}
        value={tilingX}
        onChange={(values) => {
          setTilingX(values[0]);
          console.log(values);
        }}
      />
      <RangeSlider
        domain={[0, maxTiling || 1]}
        value={tilingY}
        onChange={(values) => {
          setTilingY(values[0]);
          console.log(values);
        }}
      />
      <RangeSlider
        domain={[0, maxTiling || 1]}
        value={tilingZ}
        onChange={(values) => {
          setTilingZ(values[0]);
          console.log(values);
        }}
      />
    </div>
  );
};
