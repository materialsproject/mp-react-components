import React from 'react';
import { Story } from '@storybook/react';
import { InferProps } from 'prop-types';
import ReactGraphComponent from '../../components/crystal-toolkit/graph.component';
import { DEFAULT_OPTIONS, GRAPH } from '../constants';

export default {
  component: ReactGraphComponent,
  title: 'Crystal Toolkit/ReactGraphComponent'
};

const Template: Story<React.PropsWithChildren<InferProps<typeof ReactGraphComponent.propTypes>>> = (
  args
) => <ReactGraphComponent {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  graph: GRAPH,
  options: DEFAULT_OPTIONS
};
