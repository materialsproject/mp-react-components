import { mount } from "enzyme";
import * as React from "react";
import { PeriodicContext } from "./periodic-table-state/periodic-selection-context";
import { SelectableTable } from "./table-state";

// JEST does not know how to handle LESS, so we simply mock the CSS an empty file.
// If we are going to use JSDOM, and check width/height/stuff, we'll need to find a way
jest.mock('./periodic-table-component/periodic-table.module.less', () => {});
jest.mock('./periodic-element/periodic-element.module.less', () => {});
jest.mock('./periodic-element/periodic-element.detailed.less', () => {});

const enabled = ['H', 'Li'];

describe('<SelectableTable/>', () => {

  it('should be rendered', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement([], [...enabled],  [], mockCallback);
    expect(wrapper.find('.table-container').length).toBe(1);
    expect(wrapper.find('.mat-element').length).toBe(120);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toBeCalledWith(enabled);
  });
  it('callback sgould be correctly called', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement([], [], [], mockCallback);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toBeCalledWith([]);
  });

  it('clicking on an element should call the callback', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement([], [...enabled], [], mockCallback);
    wrapper.find('.mat-element').at(1).simulate('click'); // click on he
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toBeCalledWith(['H', 'Li', 'He']);
  });

  //TODO(layout/callback/detailed)
  it('should respect the max number of element selected', ()=> {
    const mockCallback = jest.fn();
    const wrapper = renderElement([], [], [], mockCallback, 1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toBeCalledWith([]);
    wrapper.find('.mat-element').at(1).simulate('click'); // click on he
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toBeCalledWith(['He']);
    wrapper.find('.mat-element').at(2).simulate('click'); // click on li
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toBeCalledWith(['Li']);
  });

  //TODO(chab) changing the props should RENDER the table
  xit('it should rerender correctly when the hidden/enabled/selected props are updated', () => {

  });
  //TODO(chab) check what happens if the number of enabled elements > maximum allowed
  xit('', () => {

  });

  xit('it should integrates with filter correctly', () => {

  });

  it('it should display hovered element', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement([], [], [], mockCallback, 1);
    wrapper.find('.mat-element').at(1).simulate('mouseover');
    expect(wrapper.find('.element-description').length).toBe(1);
    expect(wrapper.find('.element-description .mat-name').text()).toEqual('Helium');
    expect(wrapper.find('.element-description .mat-symbol').text().trim()).toEqual('He'); // why the spaces ?
    expect(wrapper.find('.element-description .mat-number').text()).toEqual('2');

  })
});

function renderElement(disabled = [] as string[],
                       enabled = [] as string[],
                       hidden = [] as string[],
                       onStateChange = (c: string[]) => { console.log('>>>>>>>>>>>>>>>>>>>>', c)},
                       maxNumber = 5
) {
  // we use mount to test the rendering of the underlying elements
  return mount(<PeriodicContext>
    <SelectableTable enabledElements={enabled}
                     disabledElements={disabled}
                     forwardOuterChange={true}
                     onStateChange={onStateChange}
                     hiddenElements={hidden}
                     maxElementSelectable={maxNumber}/>

  </PeriodicContext>)

}

