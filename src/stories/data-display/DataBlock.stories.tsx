import React from 'react';
import { Story } from '@storybook/react';
import { DataBlock } from '../../components/data-display/DataBlock';
import { DataBlockProps } from '../../components/data-display/DataBlock/DataBlock';
import { Column } from '../../components/data-display/SearchUI/types';

export default {
  component: DataBlock,
  title: 'Data-Display/DataBlock'
};

const Template: Story<React.PropsWithChildren<DataBlockProps>> = (args) => <DataBlock {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  disableRichColumnHeaders: true,
  className: 'box',
  data: {
    material_id: 'mp-19395',
    formula_pretty: 'MnO2',
    volume: 143.9321176
  },
  columns: [
    {
      title: 'Material ID',
      selector: 'material_id',
      formatType: 'LINK',
      formatOptions: {
        baseUrl: 'https://next-gen.materialsproject.org',
        target: '_blank'
      },
      minWidth: '300px',
      maxWidth: '300px'
    },
    {
      title: 'Formula',
      selector: 'formula_pretty',
      formatType: 'FORMULA',
      minWidth: '300px',
      maxWidth: '300px'
    },
    {
      title: 'Volume',
      selector: 'volume',
      formatType: 'FIXED_DECIMAL',
      formatOptions: {
        decimals: 2
      }
    }
  ] as Column[]
};

export const WithBottomSection = Template.bind({});
WithBottomSection.args = {
  ...Basic.args,
  data: {
    material_id: 'mp-19395',
    formula_pretty: 'MnO2',
    volume: 143.9321176,
    density: 4.012746729,
    crystal_system: 'Tetragonal',
    description: 'Ab-initio electronic transport database for inorganic materials'
  },
  columns: [
    {
      title: 'Material ID',
      selector: 'material_id',
      formatType: 'LINK',
      formatOptions: {
        baseUrl: 'https://next-gen.materialsproject.org',
        target: '_blank'
      },
      minWidth: '300px',
      maxWidth: '300px'
    },
    {
      title: 'Formula',
      selector: 'formula_pretty',
      formatType: 'FORMULA',
      minWidth: '300px',
      maxWidth: '300px'
    },
    {
      title: 'Volume',
      selector: 'volume',
      formatType: 'FIXED_DECIMAL',
      formatOptions: {
        decimals: 2
      }
    },
    {
      title: 'Density',
      selector: 'density',
      isBottom: true,
      formatType: 'FIXED_DECIMAL',
      formatOptions: {
        decimals: 2
      }
    },
    {
      title: 'Crystal System',
      selector: 'crystal_system',
      isBottom: true
    },
    {
      title: 'Description',
      selector: 'description',
      isBottom: true
    }
  ] as Column[]
};

export const WithFooter = Template.bind({});
WithFooter.args = {
  ...Basic.args,
  data: {
    material_id: 'mp-19395',
    formula_pretty: 'MnO2',
    volume: 143.9321176,
    density: 4.012746729,
    crystal_system: 'Tetragonal',
    description: 'Ab-initio electronic transport database for inorganic materials'
  },
  columns: [
    {
      title: 'Material ID',
      selector: 'material_id',
      formatType: 'LINK',
      formatOptions: {
        baseUrl: 'https://next-gen.materialsproject.org',
        target: '_blank'
      },
      minWidth: '300px',
      maxWidth: '300px'
    },
    {
      title: 'Formula',
      selector: 'formula_pretty',
      formatType: 'FORMULA',
      minWidth: '300px',
      maxWidth: '300px'
    },
    {
      title: 'Volume',
      selector: 'volume',
      formatType: 'FIXED_DECIMAL',
      formatOptions: {
        decimals: 2
      }
    },
    {
      title: 'Density',
      selector: 'density',
      isBottom: true,
      formatType: 'FIXED_DECIMAL',
      formatOptions: {
        decimals: 2
      }
    },
    {
      title: 'Crystal System',
      selector: 'crystal_system',
      isBottom: true
    },
    {
      title: 'Description',
      selector: 'description',
      isBottom: true
    }
  ] as Column[],
  footer: 'Footer content'
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  ...Basic.args,
  iconClassName: 'square',
  iconTooltip: 'Square'
};

export const WithArrayItems = Template.bind({});
WithArrayItems.args = {
  ...Basic.args,
  data: {
    formula_pretty: 'MnO2',
    volume: 143.9321176,
    tables: ['AA', 'BB', 'CC', 'DD', 'EE'],
    tablesTooltips: ['Table AA', 'Table BB', 'Table CC', 'Table DD', 'Table EE']
  },
  columns: [
    {
      title: 'Formula',
      selector: 'formula_pretty',
      formatType: 'FORMULA',
      minWidth: '300px',
      maxWidth: '300px'
    },
    {
      title: 'Tables',
      selector: 'tables',
      formatType: 'ARRAY',
      formatOptions: {
        arrayTooltipsKey: 'tablesTooltips'
      }
    }
  ] as Column[]
};

export const WithArrayDownloadLinks = Template.bind({});
WithArrayDownloadLinks.args = {
  ...Basic.args,
  data: {
    formula_pretty: 'MnO2',
    volume: 143.9321176,
    tables: ['AA', 'BB', 'CC', 'DD', 'EE'],
    tablesTooltips: ['Table AA', 'Table BB', 'Table CC', 'Table DD', 'Table EE'],
    tablesLinks: [
      'https://github.com',
      'https://github.com',
      'https://github.com',
      'https://github.com',
      'https://github.com'
    ]
  },
  columns: [
    {
      title: 'Formula',
      selector: 'formula_pretty',
      formatType: 'FORMULA',
      minWidth: '300px',
      maxWidth: '300px'
    },
    {
      title: 'Tables',
      selector: 'tables',
      formatType: 'ARRAY',
      formatOptions: {
        arrayTooltipsKey: 'tablesTooltips',
        arrayLinksKey: 'tablesLinks',
        arrayLinksShowDownload: true
      }
    }
  ] as Column[]
};
