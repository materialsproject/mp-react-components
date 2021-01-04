import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { act } from "react-dom/test-utils";
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react'
import { MaterialsInput, MaterialsInputProps } from '.';
import { SelectableTable } from '../../periodic-table/table-state';

jest.mock('./MaterialsInput.css', () => {});
jest.mock('./MaterialsInputFormulaButtons/MaterialsInputFormulaButtons.css', () => {});
jest.mock('../../periodic-table/periodic-table-component/periodic-table.module.less', () => {});
jest.mock('../../periodic-table/periodic-element/periodic-element.module.less', () => {});
jest.mock('../../periodic-table/periodic-element/periodic-element.detailed.less', () => {});

afterEach(() => cleanup());

const defaultProps = {
  value: '',
  field: 'elements',
  periodicTableMode: "toggle",
  onChange: (value: string) => null
};

const renderElement = (props: MaterialsInputProps) => {
  render(
    <MaterialsInput
      {...props}
    />
  );
};

describe('<MaterialsInput/>', () => {
  it('should render periodic table, tooltip control, and search button', () => {
    renderElement({
        ...defaultProps,
        tooltip: "Test tooltip",
        onSubmit: (value) => null
    });
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-button')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
    expect(screen.getByTestId('periodic-table')).toBeInTheDocument();
  });

  it('should enable elements', () => {
    renderElement({ ...defaultProps });
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Ga, N' } });
    expect(screen.getByText('Ga').parentElement).toHaveClass('enabled');
    expect(screen.getByText('N').parentElement).toHaveClass('enabled');
  });

  it('should switch to formula mode', () => {
    renderElement({
      ...defaultProps,
      onFieldChange: (field) => field
    });
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'GaN' } });
    expect(screen.getByText('Ga').parentElement).toHaveClass('enabled');
    expect(screen.getByText('N').parentElement).toHaveClass('enabled');
    expect(screen.getByText('1')).toBeDefined();
  });

  it('should toggle periodic table', () => {
    renderElement({ ...defaultProps });
    expect(screen.getByTestId('toggle-button').firstChild).toHaveClass('is-active');
    expect(screen.getByTestId('periodic-table')).toHaveAttribute('aria-hidden', 'false');
    fireEvent.click(screen.getByTestId('toggle-button'));
    expect(screen.getByTestId('toggle-button').firstChild).not.toHaveClass('is-active');
    expect(screen.getByTestId('periodic-table')).toHaveAttribute('aria-hidden', 'true');
  });

  it('should update input on element click', () => {
    renderElement({ ...defaultProps });
    fireEvent.click(screen.getByText('Fe'));
    fireEvent.click(screen.getByText('Co'));
    expect(screen.getByTestId('search-input')).toHaveValue('Fe,Co');
    fireEvent.click(screen.getByText('Fe'));
    fireEvent.click(screen.getByText('Co'));
    expect(screen.getByTestId('search-input')).toHaveValue('');
  });

  it('should show periodic table on focus', () => {
    renderElement({ 
      ...defaultProps,
      periodicTableMode: 'onFocus'
    });
    expect(screen.getByTestId('periodic-table')).toHaveAttribute('aria-hidden', 'true');
    screen.getByTestId('search-input').focus();
    expect(screen.getByTestId('periodic-table')).toHaveAttribute('aria-hidden', 'false');
  });

  it('should stay focused on element click', () => {
    renderElement({ 
      ...defaultProps,
      periodicTableMode: 'onFocus'
    });
    screen.getByTestId('search-input').focus();
    fireEvent.click(screen.getByText('Fe'));
    expect(screen.getByTestId('search-input')).toHaveFocus();
  });

  it('should show autocomplete results', async () => {
    renderElement({ 
      ...defaultProps,
      field: 'formula',
      autocompleteFormulaUrl: process.env.REACT_APP_AUTOCOMPLETE_URL,
      autocompleteApiKey: process.env.REACT_APP_API_KEY
    });
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'GaN' } });
    screen.getByTestId('search-input').focus();
    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-menu')).not.toHaveClass('is-hidden');
      expect(screen.getByTestId('autocomplete-menu-items').childNodes.length).toBeGreaterThan(1);
    });
  });
});