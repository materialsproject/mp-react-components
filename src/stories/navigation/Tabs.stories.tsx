import React from 'react';
import { Story } from '@storybook/react';
import { Tabs } from '../../components/navigation/Tabs';
import { TabsProps } from '../../components/navigation/Tabs/Tabs';

export default {
  component: Tabs,
  title: 'Navigation/Tabs'
};

const Template: Story<React.PropsWithChildren<TabsProps>> = (args) => (
  <Tabs {...args}>
    <div>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum excepturi dolor eveniet
      doloremque vero autem eaque magni. Quo quis maiores illo cum! Quasi cum fugit animi quis
      praesentium saepe veritatis.
    </div>
    <div>
      Unde laudantium voluptates eaque sequi, earum dolorum optio quos consequuntur. Numquam alias
      consequuntur quis, eveniet aut praesentium ratione rerum laborum ea labore!
    </div>
  </Tabs>
);

export const Basic = Template.bind({});
Basic.args = {
  labels: ['One', 'Two']
};
