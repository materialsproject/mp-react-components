import { shallow } from 'enzyme';
import { PeriodicElement } from "./periodic-element.component";
import * as React from 'react'; // for some reasons, uppercase does not work on Docker
import { TABLE_DICO_V2 } from "../periodic-table-data/table-v2";

// JEST does not know how to handle LESS, so we simply mock the CSS an empty file.
// If we are going to use JSDOM, and check width/height/stuff, we'll need to find a way
jest.mock('./periodic-element.module.less', () => {});
jest.mock('./periodic-element.detailed.less', () => {});

describe('<PeriodicElement/>', () => {

  it('should be rendered', () => {
    const wrapper = renderElement();
    expect(wrapper.find('.mat-element').length).toBe(1);
    expect(wrapper.find('.mat-element').hasClass('disabled')).toBe(false);
    expect(wrapper.find('.mat-element').hasClass('enabled')).toBe(false);
  });
  it('should have correct enabled/disabled state / 1', () => {
    const wrapper = renderElement(true, true);
    expect(wrapper.find('.mat-element').hasClass('disabled')).toBe(true);
    expect(wrapper.find('.mat-element').hasClass('enabled')).toBe(false);
  });
  it('should have correct enabled/disabled state / 2', () => {
    const wrapper = renderElement(true, true);
    expect(wrapper.find('.mat-element').hasClass('disabled')).toBe(true);
    expect(wrapper.find('.mat-element').hasClass('enabled')).toBe(false);
  });
  it('should have correct enabled/disabled state / 3', () => {
    const wrapper = renderElement(true, false);
    expect(wrapper.find('.mat-element').hasClass('disabled')).toBe(true);
    expect(wrapper.find('.mat-element').hasClass('enabled')).toBe(false);
  });
  it('click callback shoud be called', ()=> {
    const mockCallBack = jest.fn();
    const wrapper = renderElement(true, false, mockCallBack);
    wrapper.find('.mat-element').simulate('click');
    expect(mockCallBack).toHaveBeenCalledTimes(1);
  })
});

const TEST_ELEMENT = TABLE_DICO_V2['H'];

function renderElement(disabled = false,
                       enabled = false,
                       onClick = () => {},
                       element = TEST_ELEMENT
                      ) {
  return shallow(<PeriodicElement
    disabled={disabled}
    enabled={enabled}
    hidden={false}
    element={element}
    onElementHovered={onClick}
    onElementClicked={onClick}/>)
}
