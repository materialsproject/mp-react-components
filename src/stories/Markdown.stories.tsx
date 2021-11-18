import React from 'react';
import { Story } from '@storybook/react';
import { Markdown } from '../components/data-display/Markdown';
import { MarkdownProps } from '../components/data-display/Markdown/Markdown';

export default {
  component: Markdown,
  title: 'Data-Display/Markdown'
};

const Template: Story<React.PropsWithChildren<MarkdownProps>> = (args) => <Markdown {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  className: 'content',
  children: `
    ## Markdown Heading 2
    Markdown content
  `
};

export const CodeBlock = Template.bind({});
CodeBlock.args = {
  children: `
    ~~~python
    from mp_api.matproj import MPRester
    with MPRester(api_key="your_api_key_here") as mpr:
      materials_docs = mpr.materials.search(nsites=[2, 4])
  `
};
