import { mount } from "enzyme";
import * as React from "react";
import { PeriodicContext } from "./periodic-table-state/periodic-selection-context";
import { SelectableTable } from "./table-state";

// JEST does not know how to handle LESS, so we simply mock the CSS an empty file.
// If we are going to use JSDOM, and check width/height/stuff, we'll need to find a way
jest.mock('./periodic-table-component/periodic-table.module.less', () => {});
jest.mock('./periodic-element/periodic-element.module.less', () => {});
jest.mock('./periodic-element/periodic-element.detailed.less', () => {});

const enabled = {H: true, Li: true};

describe('<SelectableTable/>', () => {

  it('should be rendered', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement({}, {...enabled}, {}, mockCallback);
    expect(wrapper.find('.table-container').length).toBe(1);
    expect(wrapper.find('.mat-element').length).toBe(120);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toBeCalledWith(enabled);
  });
  it('callback sgould be correctly called', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement({}, {}, {}, mockCallback);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toBeCalledWith({});
  });

  it('clicking on an element should call the callback', () => {
    const mockCallback = jest.fn();
    const wrapper = renderElement({}, {...enabled}, {}, mockCallback);
    wrapper.find('.mat-element').at(1).simulate('click'); // click on he
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toBeCalledWith({...enabled, He: true});
  });

  //TODO(layout/callback/detailed)
  it('should respect the max number of element selected', ()=> {
    const mockCallback = jest.fn();
    const wrapper = renderElement({}, {}, {}, mockCallback, 1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toBeCalledWith({});
    wrapper.find('.mat-element').at(1).simulate('click'); // click on he
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toBeCalledWith({He:true});
    wrapper.find('.mat-element').at(2).simulate('click'); // click on li
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toBeCalledWith({He:false, Li: true});

  });
});

function renderElement(disabled = {},
                       enabled = {},
                       hidden = {},
                       onStateChange = (c: any) => { console.log('>>>>>>>>>>>>>>>>>>>>', c)},
                       maxNumber = 5
) {
  // we use mount to test the rendering of the underlying elements
  return mount(<PeriodicContext>
    <SelectableTable enabledElements={enabled}
                     disabledElements={disabled}
                     onStateChange={onStateChange}
                     hiddenElements={hidden}
                     maxElementSelectable={maxNumber}/>

  </PeriodicContext>)

}

