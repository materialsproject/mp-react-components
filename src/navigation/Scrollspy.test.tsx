import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { Scrollspy } from './Scrollspy';

describe('Scrollspy', () => {
  it('should be rendered', () => {
    const menuGroups = [
      {
        label: 'Menu Group 1',
        items: [
          {
            label: 'Menu Item 1',
            targetId: 'one'
          },
          {
            label: 'Menu Item 2',
            targetId: 'two',
            items: [
              {
                label: 'Sub Menu Item 2.1',
                targetId: 'two-one'
              },
              {
                label: 'Sub Menu Item 2.2',
                targetId: 'two-two'
              }
            ]
          },
          {
            label: 'Menu Item 3',
            targetId: 'three'
          }
        ]
      },
      {
        label: 'Menu Group 2',
        items: [
          {
            label: 'Menu Item 4',
            targetId: 'four'
          },
          {
            label: 'Menu Item 5',
            targetId: 'five'
          }
        ]
      }
    ];

    const wrapper = shallow(<Scrollspy 
      menuGroups={menuGroups}
      activeClassName='is-active'
    />);
    const firstItem = wrapper.find('li').first();
    expect(firstItem.text()).toBe('Menu Item 1');
  });
});


