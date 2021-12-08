import React from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import { MaterialsInput, MaterialsInputType, MaterialsInputProps } from '.';
import { autocompleteQuery } from '../../../mocks/constants/autocomplete';
import { PeriodicTableMode } from './MaterialsInput';

afterEach(() => cleanup());

const defaultProps = {
  value: '',
  inputType: 'elements' as MaterialsInputType,
  periodicTableMode: PeriodicTableMode.TOGGLE,
  helpItems: [{ label: 'Search Help' }],
  onChange: (value: string) => null
};

const renderElement = (props: MaterialsInputProps) => {
  render(<MaterialsInput {...props} />);
};

describe('<MaterialsInput/>', () => {
  it('should render periodic table and search button', () => {
    renderElement({
      ...defaultProps,
      onSubmit: (value) => null
    });
    expect(screen.getByTestId('materials-input-search-input')).toBeInTheDocument();
    expect(screen.getByTestId('materials-input-form')).toBeInTheDocument();
    expect(screen.getByTestId('materials-input-periodic-table')).toBeInTheDocument();
  });

  it('should enable elements', () => {
    renderElement({ ...defaultProps });
    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'Ga, N' }
    });
    expect(screen.getByText('Ga').parentElement).toHaveClass('enabled');
    expect(screen.getByText('N').parentElement).toHaveClass('enabled');
  });

  it('should switch to formula mode', () => {
    renderElement({
      ...defaultProps,
      onInputTypeChange: (field) => field
    });
    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'GaN' }
    });
    expect(screen.getByText('Ga').parentElement).toHaveClass('enabled');
    expect(screen.getByText('N').parentElement).toHaveClass('enabled');
    expect(screen.getByText('(')).toBeDefined();
  });

  it('should toggle periodic table', () => {
    renderElement({ ...defaultProps });
    expect(screen.getByTestId('materials-input-toggle-button').firstChild).toHaveClass('is-active');
    expect(screen.getByTestId('materials-input-periodic-table')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
    fireEvent.click(screen.getByTestId('materials-input-toggle-button'));
    expect(screen.getByTestId('materials-input-toggle-button').firstChild).not.toHaveClass(
      'is-active'
    );
    expect(screen.getByTestId('materials-input-periodic-table')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('should update input on element click', () => {
    renderElement({ ...defaultProps });
    fireEvent.click(screen.getByText('Fe'));
    fireEvent.click(screen.getByText('Co'));
    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('Fe,Co');
    fireEvent.click(screen.getByText('Fe'));
    fireEvent.click(screen.getByText('Co'));
    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('');
  });

  it('should show periodic table on focus', () => {
    renderElement({
      ...defaultProps,
      periodicTableMode: PeriodicTableMode.FOCUS
    });
    expect(screen.getByTestId('materials-input-periodic-table')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    screen.getByTestId('materials-input-search-input').focus();
    expect(screen.getByTestId('materials-input-periodic-table')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
  });

  it('should stay focused on element click', () => {
    renderElement({
      ...defaultProps,
      periodicTableMode: PeriodicTableMode.FOCUS
    });
    screen.getByTestId('materials-input-search-input').focus();
    fireEvent.click(screen.getByText('Fe'));
    expect(screen.getByTestId('materials-input-search-input')).toHaveFocus();
  });

  it('should show autocomplete results', async () => {
    renderElement({
      ...defaultProps,
      type: 'formula' as MaterialsInputType,
      autocompleteFormulaUrl: process.env.REACT_APP_AUTOCOMPLETE_URL,
      autocompleteApiKey: process.env.REACT_APP_API_KEY
    });
    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: autocompleteQuery }
    });
    screen.getByTestId('materials-input-search-input').focus();
    await waitFor(() => {
      expect(screen.getByTestId('materials-input-autocomplete-menu')).not.toHaveClass('is-hidden');
      expect(
        screen.getByTestId('materials-input-autocomplete-menu-items').childNodes.length
      ).toBeGreaterThan(1);
    });
  });
});
