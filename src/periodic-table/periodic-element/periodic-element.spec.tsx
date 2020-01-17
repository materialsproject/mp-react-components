import * as React from 'React';
import { shallow } from 'enzyme';
import { PeriodicElement } from "./periodic-element.component";

//JEST does not know how to handle LESS
jest.mock('./periodic-element.module.less', () => {});

fdescribe('<PeriodicElement/>', () => {

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


function renderElement(disabled = false,
                       enabled = false,
                       onClick = () => {},
                       element = {class:'a', symbol:'H', elementNumber:'12'},
                      ) {
  return shallow(<PeriodicElement disabled={disabled} enabled={enabled} element={element} onElementClicked={onClick}/>)
}
