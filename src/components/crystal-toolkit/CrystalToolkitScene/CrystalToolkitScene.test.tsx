import { mount } from 'enzyme';
import * as React from 'react';
import { CrystalToolkitScene } from './CrystalToolkitScene';
import { s2 as scene } from '../scene/simple-scene';
import { MOUNT_NODE_CLASS, Renderer } from '../scene/constants';
import Scene from '../scene/Scene';

const spy = jest.spyOn(Scene.prototype, 'renderScene');
const RENDERSCENE_CALLS_BY_REACT_RENDERING = 1; // goal is to reach 1 and stay there :)

// When we run test, three.js is bundled differently, and we encounter again the bug
// where we have 2 different instances of three
describe('<CrystalToolkitScene/>', () => {
  it('should be rendered', () => {
    const wrapper = renderElement();
    expect(wrapper.find(`.${MOUNT_NODE_CLASS}`).length).toBe(1);
    expect(wrapper.find(`.three-wrapper`).length).toBe(1);

    // Note(chab) we call renderScene when we mount, due to the react effect
    // those are the three call sites (constructor / toggleVis / inlet )
    expect(spy).toBeCalledTimes(1 * RENDERSCENE_CALLS_BY_REACT_RENDERING);

    // fails because SVGRender will import a different instance of Three
    // expect(wrapper.find('path').length).toBe(6);
  });

  it('should re-render if we change the size of the screen', () => {
    const wrapper = renderElement();
    wrapper.setProps({ size: 400 });
    expect(spy).toBeCalledTimes(2 * RENDERSCENE_CALLS_BY_REACT_RENDERING);
  });
});

function renderElement() {
  // we use mount to test the rendering of the underlying elements
  return mount(
    <CrystalToolkitScene
      sceneSize={500}
      settings={{
        renderer: Renderer.SVG
      }}
      data={scene}
      debug={false}
      toggleVisibility={{}}
    />
  );
}
