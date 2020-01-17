import * as React from 'React';
import { shallow } from 'enzyme';
import { PeriodicElement } from "./periodic-element.component";

//JEST does not know how to handle LESS
jest.mock('./periodic-element.module.less', () => {});

describe('<PeriodicElement/>', () => {
  const wrapper = shallow(<PeriodicElement
    onElementClicked={()=>{}}
    disabled={true}
    enabled={false}
    element={{class:'a', symbol:'H', elementNumber:'12'}} />);


  fit('should have correct class', () => {
    expect(wrapper.find('.mat-element').hasClass('m')).toBe(false);
  });
  it('should have correct enabled/disabled state', () => {

  });

});
