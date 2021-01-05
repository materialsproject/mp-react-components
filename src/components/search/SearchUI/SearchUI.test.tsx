import React from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react'
import { SearchUI, SearchUIProps } from '.';
import { materialsColumns, materialsGroups } from '../../../data/materials';
import { materialIdParam } from '../../../mocks/data/materialId';

jest.mock('./SearchUI.css', () => {});
jest.mock('../MaterialsInput/MaterialsInput.css', () => {});
jest.mock('../MaterialsInput/MaterialsInputFormulaButtons/MaterialsInputFormulaButtons.css', () => {});
jest.mock('../DualRangeSlider/DualRangeSlider.css', () => {});
jest.mock('../Select/Select.css', () => {});
jest.mock('../../periodic-table/periodic-table-component/periodic-table.module.less', () => {});
jest.mock('../../periodic-table/periodic-element/periodic-element.module.less', () => {});
jest.mock('../../periodic-table/periodic-element/periodic-element.detailed.less', () => {});

afterEach(() => cleanup());

const defaultProps = {
  resultLabel: "material",
  columns: materialsColumns,
  filterGroups: materialsGroups,
  baseURL: process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + 'search/' : '',
  autocompleteFormulaUrl: process.env.REACT_APP_AUTOCOMPLETE_URL ? process.env.REACT_APP_AUTOCOMPLETE_URL  : undefined,
  apiKey: undefined,
  searchBarTooltip: "Type in a comma-separated list of element symbols (e.g. Ga, N), a chemical formula (e.g. C3N), or a material id (e.g. mp-10152). You can also click elements on the periodic table to add them to your search.",
  searchBarPlaceholder: "Search by elements, formula, or mp-id",
  sortField: "e_above_hull",
  sortAscending: true
};

const renderElement = (props: SearchUIProps) => {
  render(
    <SearchUI
      {...props}
    />
  );
};

describe('<SearchUI/>', () => {
  it('should render search bar', () => {
    renderElement({...defaultProps});
    expect(screen.getAllByTestId('materials-input-search-input')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('materials-input-form')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('materials-input-periodic-table')[0]).toBeInTheDocument();
  });

  it('should render filters', () => {
    renderElement({...defaultProps});
    expect(screen.getByTestId('panel-block-container').childNodes.length).toBe(5);
  });

  it('should render data table components', async () => {
    renderElement({...defaultProps});
    expect(screen.getByTestId('data-table-title')).toBeInTheDocument();
    expect(screen.getByTestId('columns-menu')).toBeInTheDocument();
    expect(screen.getByTestId('results-per-page-menu')).toBeInTheDocument();
    expect(screen.getByTestId('react-data-table-container')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBe(16);
    });
  });

  it('should return one filtered result', async () => {
    renderElement({...defaultProps});
    fireEvent.change(screen.getAllByTestId('materials-input-search-input')[0], { target: { value: materialIdParam } });
    fireEvent.submit(screen.getByTestId('materials-input-form'));
    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBe(2);
    });
  });
});