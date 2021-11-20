import React from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import { DataBlock } from '.';
import { Column } from '../SearchUI/types';

describe('<DataBlock/>', () => {
  it('should render data items', () => {
    render(<DataBlock {...defaultProps} />);
    expect(screen.getAllByText(/mp-777/i)).toHaveLength(1);
    expect(screen.getAllByText(/material id/i)).toHaveLength(1);
    expect(screen.getAllByText(/formula/i)).toHaveLength(1);
    expect(screen.getAllByText(/data items/i)).toHaveLength(1);
    expect(screen.getAllByText(/tables/i)).toHaveLength(1);
    expect(screen.getAllByText(/description/i)).toHaveLength(1);
    expect(screen.getAllByText(/footer/i)).toHaveLength(1);
  });
  it('should render formula text as formula components', () => {
    render(<DataBlock {...defaultProps} />);
    expect(screen.getAllByTestId('formula')).toHaveLength(2);
  });
  it('should render array chips', () => {
    render(<DataBlock {...defaultProps} />);
    expect(screen.getAllByTestId('array-chips')).toHaveLength(2);
  });
  it('should render icon', () => {
    render(<DataBlock {...defaultProps} />);
    expect(screen.getByTestId('data-block-icon')).toBeInTheDocument();
  });
  it('should be expandable', async () => {
    render(<DataBlock {...defaultProps} />);
    fireEvent.click(screen.getByText('See more'));
    await waitFor(() => {
      expect(screen.getByText('See less')).toBeInTheDocument();
    });
  });
});

const defaultProps = {
  data: {
    material_id: 'mp-777',
    formula_pretty: 'MnO2',
    volume: 34.88345346,
    data: [1, 'LiAl(SiO3)2', 3, 1, 2, 3, 1, 2, 3, 1, 2],
    dataTooltips: ['test one', 'test two', 'test three', 'test four'],
    tables: [1, 2, 3],
    tablesTooltips: ['test', 'test'],
    tablesLinks: ['https://doi.org/10.1038/sdata.2017.85', 'https://lbl.gov'],
    description: 'Ab-initio electronic transport database for inorganic materials'
  },
  columns: [
    {
      title: 'Material ID',
      selector: 'material_id',
      formatType: 'LINK',
      formatOptions: {
        baseUrl: 'https://lbl.gov',
        target: '_blank'
      },
      minWidth: '300px',
      maxWidth: '300px',
      isTop: true
    },
    {
      title: 'Formula',
      selector: 'formula_pretty',
      formatType: 'FORMULA',
      minWidth: '300px',
      maxWidth: '300px',
      isTop: true
    },
    {
      title: 'Data Items',
      selector: 'data',
      formatType: 'ARRAY',
      formatOptions: {
        arrayTooltipsKey: 'dataTooltips'
      }
    },
    {
      title: 'Tables',
      selector: 'tables',
      formatType: 'ARRAY',
      formatOptions: {
        arrayTooltipsKey: 'tablesTooltips',
        arrayLinksKey: 'tablesLinks',
        arrayLinksShowDownload: false,
        arrayChipType: 'dynamic-publications'
      },
      isBottom: true
    },
    {
      title: 'Description',
      selector: 'description',
      isBottom: true
    }
  ] as Column[],
  footer: <div>Footer</div>,
  iconClasstitle: 'fas fa-pizza-slice',
  iconTooltip: 'Pizza'
};
