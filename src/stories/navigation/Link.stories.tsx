import React from 'react';
import { StoryFn } from '@storybook/react';
import { Link } from '../../components/navigation/Link';
import { LinkProps } from '../../components/navigation/Link/Link';

export default {
  component: Link,
  title: 'Navigation/Link'
};

const Template: StoryFn<React.PropsWithChildren<LinkProps>> = (args) => <Link {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Link to page',
  href: '/page'
};

export const PreserveQueryParameters = Template.bind({});
PreserveQueryParameters.args = {
  children: 'Link that preserves existing query parameters',
  href: '/page',
  preserveQuery: true
};
