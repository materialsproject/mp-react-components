import React from 'react';
import { Story } from '@storybook/react';
import { JsonView } from '../../components/data-display/JsonView';
import { InferProps } from 'prop-types';

export default {
  component: JsonView,
  title: 'Data-Display/JsonView'
};

const Template: Story<React.PropsWithChildren<InferProps<typeof JsonView.propTypes>>> = (args) => (
  <JsonView {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  src: { a: { b: { c: { d: '12' } } } }
};
