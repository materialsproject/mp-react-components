import React from 'react';
import { Story } from '@storybook/react';
import { Navbar } from '../../components/navigation/Navbar';
import { NavbarProps } from '../../components/navigation/Navbar/Navbar';

export default {
  component: Navbar,
  title: 'Navigation/Navbar'
};

const Template: Story<React.PropsWithChildren<NavbarProps>> = (args) => <Navbar {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  brandItem: {
    label: 'MP React',
    href: '/materials'
  },
  items: [
    {
      label: 'Materials',
      href: '/materials'
    },
    {
      label: 'Molecules',
      href: '/molecules'
    },
    {
      label: 'Batteries',
      href: '/batteries'
    },
    {
      label: 'Synthesis',
      href: '/synthesis'
    },
    {
      label: 'Catalysts',
      href: '/catalysts'
    },
    {
      label: 'More',
      isRight: true,
      items: [
        {
          label: 'Other Pages',
          isMenuLabel: true
        },
        {
          label: 'Publications',
          href: '/publications'
        },
        {
          label: 'Contributions',
          href: '/contribs'
        },
        {
          label: 'Crystal Structure',
          href: '/crystal'
        },
        {
          label: 'Sandbox',
          href: '/sandbox'
        }
      ]
    }
  ]
};
