import { mount } from 'enzyme';
import * as React from 'react';
import { PeriodicContext } from './periodic-table-state/periodic-selection-context';
import { SelectableTable } from './table-state';

const enabled = ['H', 'Li'];

describe('<SelectableTable/>', () => {
  fit('should be rendered', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement([], [...enabled], [], mockCallback);
    expect(wrapper.find('.table-container').length).toBe(1);
    expect(wrapper.find('.mat-element').length).toBe(120);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toBeCalledWith({ disabledElements: [], enabledElements: enabled });
  });
  it('callback sgould be correctly called', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement([], [], [], mockCallback);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toBeCalledWith({ disabledElements: [], enabledElements: [] });
  });

  it('clicking on an element should call the callback', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement([], [...enabled], [], mockCallback);
    wrapper.find('.mat-element').at(1).simulate('click'); // click on he
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toBeCalledWith({
      disabledElements: [],
      enabledElements: ['H', 'Li', 'He']
    });
  });

  //TODO(layout/callback/detailed)
  it('should respect the max number of element selected', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement([], [], [], mockCallback, 1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toBeCalledWith({ disabledElements: [], enabledElements: [] });
    wrapper.find('.mat-element').at(1).simulate('click'); // click on he
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toBeCalledWith({ disabledElements: [], enabledElements: ['He'] });
    wrapper.find('.mat-element').at(2).simulate('click'); // click on li
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toBeCalledWith({ disabledElements: [], enabledElements: ['Li'] });
  });

  //TODO(chab) changing the props should RENDER the table
  xit('it should rerender correctly when the hidden/enabled/selected props are updated', () => {});
  //TODO(chab) check what happens if the number of enabled elements > maximum allowed
  xit('', () => {});

  xit('it should integrates with filter correctly', () => {});

  it('it should display hovered element', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement([], [], [], mockCallback, 1);
    wrapper.find('.mat-element').at(1).simulate('mouseover');
    expect(wrapper.find('.element-description').length).toBe(1);
    expect(wrapper.find('.element-description .mat-name').text()).toEqual('Helium');
    expect(wrapper.find('.element-description .mat-symbol').text().trim()).toEqual('He'); // why the spaces ?
    expect(wrapper.find('.element-description .mat-number').text()).toEqual('2');
  });
});

function renderElement(
  disabled = [] as string[],
  enabled = [] as string[],
  hidden = [] as string[],
  onStateChange = (c: string[]) => {
    console.log('>>>>>>>>>>>>>>>>>>>>', c);
  },
  maxNumber = 5
) {
  // we use mount to test the rendering of the underlying elements
  //TODO(chab) onStateChange actually belongs to the context :(
  return mount(
    <PeriodicContext
      enabledElements={enabled}
      disabledElements={disabled}
      hiddenElements={hidden}
      forwardOuterChange={true}
    >
      <SelectableTable onStateChange={onStateChange} maxElementSelectable={maxNumber} />
    </PeriodicContext>
  );
}
