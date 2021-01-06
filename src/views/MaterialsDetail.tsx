import React, { useState } from 'react';
import { scene, scene2 } from '../components/crystal-toolkit/scene/mike';
import { s2, s3, s4 } from '../components/crystal-toolkit/scene/simple-scene';
import { CameraContextWrapper } from '../components/crystal-toolkit/Simple3DScene/camera-context';
import { AnimationStyle, Renderer } from '../components/crystal-toolkit/Simple3DScene/constants';
import Simple3DSceneComponent from '../components/crystal-toolkit/Simple3DScene/Simple3DSceneComponent.react';
import { Scrollspy } from '../components/navigation/Scrollspy';

/**
 * Component for testing parts of the Materials Detail view
 * Includes scrollspy menu and simple 3D scene
 */

const menuContent = [
  {
    label: 'Table of Contents',
    items: [
      {
        label: 'Crystal Structure',
        targetId: 'one',
      },
      {
        label: 'Properties',
        targetId: 'two',
        items: [
          {
            label: 'Prop One',
            targetId: 'three',
          },
        ],
      },
    ],
  },
];

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

export const MaterialsDetail: React.FC = () => {
  return (
    <div className="sidebar-story">
      <Scrollspy
        menuGroups={menuContent}
        menuClassName="menu"
        menuItemContainerClassName="menu-list"
        activeClassName="is-active"
      ></Scrollspy>
      <div className="content">
        <div id="one">
          <h1>Crystal Structure</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores
            praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam
            voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?
          </p>
        </div>
        <div id="two">
          <h1>Properties</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores
            praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam
            voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?
          </p>
        </div>
        <div id="three">
          <h1>Prop One</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores
            praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam
            voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?
          </p>
        </div>
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
      </div>
    </div>
  );
};
