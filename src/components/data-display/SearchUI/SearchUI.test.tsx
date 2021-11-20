import React from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import { SearchUI, SearchUIProps } from '.';
import { Column, FilterGroup } from './types';
import filterGroups from '../../../mocks/constants/materialsFilterGroups.json';
import columns from '../../../mocks/constants/materialsColumns.json';
import { materialsByIdQuery } from '../../../mocks/constants/materialsById';
import { materialsByVolumeQuery } from '../../../mocks/constants/materialsByVolume';

/** Extend the jest timeout to allow time for async mock api requests */
jest.setTimeout(30000);

const defaultProps = {
  resultLabel: 'material',
  columns: columns as Column[],
  filterGroups: filterGroups as FilterGroup[],
  apiEndpoint: process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + 'search/' : '',
  autocompleteFormulaUrl: process.env.REACT_APP_AUTOCOMPLETE_URL
    ? process.env.REACT_APP_AUTOCOMPLETE_URL
    : undefined,
  apiKey: undefined,
  searchBarTooltip: 'Search bar help info',
  searchBarPlaceholder: 'Search by elements, formula, or mp-id',
  sortField: 'e_above_hull',
  sortAscending: true
};

const resetSearchResults = () => {
  fireEvent.click(screen.getByTestId('search-ui-reset-button'));
};

describe('<SearchUI/>', () => {
  it('should render search bar', async () => {
    // renderElement({ ...defaultProps });
    render(<SearchUI {...defaultProps} />);

    /** should render search bar */
    expect(screen.getAllByTestId('materials-input-search-input')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('materials-input-form')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('materials-input-periodic-table')[0]).toBeInTheDocument();

    /** should render filters */
    expect(screen.getByTestId('panel-block-container').childNodes.length).toBeGreaterThanOrEqual(5);

    /** should render data table components */
    expect(screen.getByTestId('data-table-title')).toBeInTheDocument();
    expect(screen.getByTestId('columns-menu')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('results-per-page-menu')).toBeInTheDocument();
      expect(screen.getAllByRole('row').length).toBe(16);
      expect(screen.getByTestId('react-data-table-container')).toBeInTheDocument();
    });

    /**
     * should return results filtered by mp-id
     * TODO: This check intermittently fails on github but not locally (??)
     */
    // fireEvent.change(screen.getAllByTestId('materials-input-search-input')[0], {
    //   target: { value: materialsByIdQuery }
    // });
    // fireEvent.submit(screen.getByTestId('materials-input-form'));
    // await waitFor(() => {
    //   expect(screen.getAllByRole('row').length).toBe(2);
    // });
    // expect(screen.getByTestId('active-filter-buttons').childNodes.length).toBe(1);

    resetSearchResults();

    /**
     * should return results filtered by mp-id  on debounce
     * TODO: Figure out how to properly test interactions that include debouncing
     */
    // // jest.useFakeTimers();
    // fireEvent.change(screen.getAllByTestId('materials-input-search-input')[1], {
    //   target: { value: materialsByIdQuery }
    // });
    // // jest.runAllTimers();
    // await waitFor(() => {
    //   expect(screen.getAllByRole('row').length).toBe(2);
    //   expect(screen.getByTestId('active-filter-buttons').childNodes.length).toBe(1);
    // }, { timeout: 10000 });
    // expect(screen.getByText(/matches/)).toBeInTheDocument();
    // // jest.useRealTimers();
    // expect(screen.getByTestId('active-filter-buttons')).toBeInTheDocument();
    // // expect(screen.getByTestId('active-filter-buttons').childNodes.length).toBe(1);
    // // await waitFor(() => {
    // //   expect(screen.getByTestId('active-filter-buttons').childNodes.length).toBe(1);
    // // });

    /** should filter results with dropdown */
    fireEvent.mouseDown(screen.getAllByText('Any')[0]);
    fireEvent.click(screen.getAllByText('Yes')[0]);
    await waitFor(() => {
      expect(screen.getByText('32,804')).toBeInTheDocument();
    });
    expect(screen.getByTestId('active-filter-buttons').childNodes.length).toBe(1);
    expect(screen.getAllByRole('row').length).toBe(16);

    resetSearchResults();

    /**
     * should filter results with slider
     * TODO: Figure out how to properly test interactions that include debouncing
     */
    // jest.useFakeTimers();
    // fireEvent.change(screen.getAllByTestId('upper-bound-input')[2], {
    //   target: { value: materialsByVolumeQuery[1] }
    // });
    // jest.runAllTimers();
    // await waitFor(() => {
    //   expect(screen.getAllByRole('row').length).toBe(10);
    // });
    // expect(screen.getByTestId('active-filter-buttons').childNodes.length).toBe(1);
  });
});
