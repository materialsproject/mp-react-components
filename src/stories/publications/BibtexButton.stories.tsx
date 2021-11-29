import React from 'react';
import { Story } from '@storybook/react';
import { BibtexButton } from '../../components/publications/BibtexButton';
import { BibtexButtonProps } from '../../components/publications/BibtexButton/BibtexButton';

export default {
  component: BibtexButton,
  title: 'Publications/BibtexButton'
};

const Template: Story<React.PropsWithChildren<BibtexButtonProps>> = (args) => (
  <BibtexButton {...args} />
);

export const FromDOI = Template.bind({});
FromDOI.args = {
  doi: '10.1093/mnras/stu869'
};

export const FromURL = Template.bind({});
FromURL.args = {
  url: 'https://scholar.googleusercontent.com/scholar.bib?q=info:sFyRnty5OLkJ:scholar.google.com/&output=citation&scisdr=CgXjl-2dEOzYpl5H9_8:AAGBfm0AAAAAYaVC7_8zAye0dAJzjnMn2xWVo4mBsAEr&scisig=AAGBfm0AAAAAYaVC7zbsW0VPNhM6Ztnin1RWNz6UG0j2&scisf=4&ct=citation&cd=-1&hl=en'
};
