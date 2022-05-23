import { Story } from '@storybook/react';
import React from 'react';
import { Scrollspy } from '../../components/navigation/Scrollspy';
import { ScrollspyProps } from '../../components/navigation/Scrollspy/Scrollspy';

export default {
  component: Scrollspy,
  title: 'Navigation/Scrollspy'
};

const Template: Story<React.PropsWithChildren<ScrollspyProps>> = (args) => (
  <div className="sidebar-story">
    <Scrollspy {...args} />
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
    </div>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  menuGroups: [
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
  ],
  menuClassName: 'menu',
  menuItemContainerClassName: 'menu-list',
  activeClassName: 'is-active'
};
