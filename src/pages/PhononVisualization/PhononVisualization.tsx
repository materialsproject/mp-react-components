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
import { useRef } from 'react';

export const PhononVisualization: React.FC = () => {
  const [dataInput, setDataInput] = useState<any>();
  const [structureContainerWidth, setStructureContainerWidth] = useState('100%');
  const structureContainer = useRef(null);

  const [value, setValue] = useState<any>('test');

  return (
    <div>
      <CrystalToolkitScene
        settings={{
          renderer: Renderer.WEBGL,
          extractAxis: false,
          zoomToFit2D: true
        }}
        data={crystalScene}
        sceneSize="100%"
        debug={false}
        toggleVisibility={{}}
      />
    </div>
  );
};
