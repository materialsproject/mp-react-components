import React, { useEffect, useState } from 'react';
import { crystalScene } from '../../components/crystal-toolkit/scene/simple-scene';
import { Renderer } from '../../components/crystal-toolkit/scene/constants';
import { CrystalToolkitScene } from '../../components/crystal-toolkit/CrystalToolkitScene/CrystalToolkitScene';
import { RangeSlider } from '../../components/data-entry/RangeSlider';

/**
 * TilingVisualization shows off the new tiling functionality added to CrystalToolkitScene.
 *
 * It uses the useState hook to attach the tiling variables to the state of the sliders.
 * These are then passed to CrystalToolkitScene as props that can be dynamically changed.
 *
 * For a diagram of how the props are organized, see here:
 * https://oac-misc.s3.us-west-1.amazonaws.com/mp/programming_plan_v2.pdf
 */
export const TilingVisualization: React.FC = () => {
  // the tiling hooks allows state to be easily set with the sliders
  const [tilingX, setTilingX] = useState<any>(2);
  const [tilingY, setTilingY] = useState<any>(1);
  const [tilingZ, setTilingZ] = useState<any>(0);
  // this sets the maximum tiling, unseen tilings are present but not visible
  const maxTiling: number = 3;

  return (
    <div>
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
        debug={false}
        toggleVisibility={{}}
      />
      {/* X slider*/}
      <RangeSlider
        domain={[0, maxTiling || 1]}
        value={tilingX}
        onChange={(values) => {
          setTilingX(values[0]);
          console.log(values);
        }}
      />
      {/* Y slider*/}
      <RangeSlider
        domain={[0, maxTiling || 1]}
        value={tilingY}
        onChange={(values) => {
          setTilingY(values[0]);
          console.log(values);
        }}
      />
      {/* Z slider*/}
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
