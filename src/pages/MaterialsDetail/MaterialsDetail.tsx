import React, { useState } from 'react';
import { scene, scene2 } from '../../components/crystal-toolkit/scene/mike';
import { s2, s3, s4 } from '../../components/crystal-toolkit/scene/simple-scene';
import { CameraContextProvider } from '../../components/crystal-toolkit/CameraContextProvider';
import { AnimationStyle, Renderer } from '../../components/crystal-toolkit/scene/constants';
import { CrystalToolkitScene } from '../../components/crystal-toolkit/CrystalToolkitScene/CrystalToolkitScene';
import { Scrollspy } from '../../components/navigation/Scrollspy';
import { Select } from '../../components/search/Select';

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
        targetId: 'one'
      },
      {
        label: 'Properties',
        targetId: 'two',
        items: [
          {
            label: 'Prop One',
            targetId: 'three'
          }
        ]
      }
    ]
  }
];

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
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={[
              { value: 1, label: 'one' },
              { value: 2, label: 'two' }
            ]}
            defaultValue={{ value: 1, label: 'one' }}
          />
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
        <CrystalToolkitScene
          settings={{
            renderer: Renderer.WEBGL,
            extractAxis: false,
            zoomToFit2D: true
          }}
          data={scene}
          debug={false}
          toggleVisibility={{}}
        />
      </div>
    </div>
  );
};
