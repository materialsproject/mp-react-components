import React, { useState, useEffect, useRef } from 'react';
import { CrystalToolkitScene } from '../CrystalToolkitScene';
import { AnimationStyle, Renderer } from '../scene/constants';

/**
 * Component for generating a CrystalToolkitScene dynamically from user-supplied JSON input
 */
export const DynamicCrystalToolkitScene: React.FC = () => {
  const [sceneData, setSceneData] = useState<Object | null>(null);
  const [showScene, setShowScene] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emptyObject = {};

  function show() {
    if (inputRef && inputRef.current) {
      const cleanJsonString = inputRef.current.value.replace(
        /(['"])?([a-z0-9A-Z_]+)(['"])?:/g,
        '"$2": '
      );
      const cleanerJsonString = cleanJsonString.replace("'", '"');
      setSceneData(JSON.parse(cleanerJsonString));
    } else {
      setSceneData(null);
    }
    setShowScene(true);
  }

  function remove() {
    setSceneData(null);
    setShowScene(false);
  }

  return (
    <div>
      <textarea ref={inputRef}></textarea>
      <button onClick={show}>show</button>
      <button onClick={remove}>remove</button>
      {showScene && sceneData ? (
        <CrystalToolkitScene
          debug={false}
          animation={AnimationStyle.NONE}
          inletPadding={10}
          inletSize={100}
          data={sceneData}
          sceneSize={400}
          toggleVisibility={emptyObject}
        />
      ) : null}
    </div>
  );
};
