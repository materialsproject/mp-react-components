import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { act } from "react-dom/test-utils";
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react'
import { MaterialsInput } from '.';

jest.mock('./MaterialsInput.css', () => {});
jest.mock('./MaterialsInputFormulaButtons/MaterialsInputFormulaButtons.css', () => {});
jest.mock('../../periodic-table/periodic-table-component/periodic-table.module.less', () => {});
jest.mock('../../periodic-table/periodic-element/periodic-element.module.less', () => {});
jest.mock('../../periodic-table/periodic-element/periodic-element.detailed.less', () => {});

afterEach(() => cleanup());

describe('<MaterialsInput/>', () => {
  it('should render periodic table, tooltip control, and search button', () => {
    render(
      <MaterialsInput
        value=""
        field="elements"
        periodicTableMode="toggle"
        tooltip="Test tooltip"
        onChange={() => null}
        onSubmit={() => null}
      />
    );
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
    expect(screen.getByTestId('periodic-table')).toBeInTheDocument();
  });

  // it('should change slider values when input changes', async () => {
  //   renderElement({
  //     domain:[-100, 100],
  //     values: [-20, 50]
  //   });
  //   fireEvent.change(screen.getByTestId('lower-bound-input'), { target: { value: 9 } });
  //   expect(screen.getByTestId('lower-bound-input')).toHaveValue(9);
  //   expect(screen.getAllByTestId('slider-button')[0]).toHaveAttribute('aria-valuenow', '9');
  // });

  // it('should prevent values outside of domain', async () => {
  //   renderElement({
  //     domain:[-100, 100],
  //     values: [-20, 50]
  //   });
  //   fireEvent.change(screen.getByTestId('lower-bound-input'), { target: { value: -111 } });
  //   expect(screen.getByTestId('lower-bound-input')).toHaveValue(-100);
  //   expect(screen.getAllByTestId('slider-button')[0]).toHaveAttribute('aria-valuenow', '-100');
  //   fireEvent.change(screen.getByTestId('lower-bound-input'), { target: { value: 70 } });
  //   expect(screen.getByTestId('lower-bound-input')).toHaveValue(70);
  //   expect(screen.getByTestId('upper-bound-input')).toHaveValue(70);
  //   expect(screen.getAllByTestId('slider-button')[0]).toHaveAttribute('aria-valuenow', '70');
  //   expect(screen.getAllByTestId('slider-button')[1]).toHaveAttribute('aria-valuenow', '70');
  // });

  // it('should use nice domain values', async () => {
  //   renderElement({
  //     domain:[-97, 88]
  //   });
  //   expect(screen.getAllByTestId('tick-value')[0]).toHaveTextContent('-100');
  //   expect(screen.getAllByTestId('tick-value')[4]).toHaveTextContent('100');
  // });
});