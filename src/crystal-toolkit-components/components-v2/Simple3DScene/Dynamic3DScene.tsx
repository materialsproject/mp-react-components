import React, { useState, useEffect, useRef } from 'react';
import Simple3DSceneComponent from './Simple3DSceneComponent.react';
import { boolean, number, object, select, withKnobs } from '@storybook/addon-knobs';
import {
  AnimationStyle,
  Renderer
} from './constants';

export const Dynamic3DScene: React.FC = () => {
  const [sceneData, setSceneData] = useState<Object | null>(null);
  const [showScene, setShowScene] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emptyObject = {};

  function show() {
    if(inputRef && inputRef.current) {
      const cleanJsonString = inputRef.current.value.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
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
      { showScene && sceneData ?
        <Simple3DSceneComponent
          debug={boolean('DEBUG', false)}
          animation={select(
            'Animation',
            [AnimationStyle.SLIDER, AnimationStyle.PLAY, AnimationStyle.NONE] as string[],
            AnimationStyle.NONE as string
          )}
          axisView={select('Axis position', ['SW', 'SE', 'NW', 'NE', 'HIDDEN'], 'SW')}
          inletPadding={number('padding', 10)}
          inletSize={number('size', 100)}
          data={object('scene', sceneData)}
          sceneSize={object('Size', 400)}
          toggleVisibility={emptyObject}
        />
      : null }
    </div>
  )
}