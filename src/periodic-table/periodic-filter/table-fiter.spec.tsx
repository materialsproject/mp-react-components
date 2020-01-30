import { shallow } from 'enzyme';
import * as React from 'react';
import { TableFilter } from "./table-filter";

jest.mock('./table-filter.less', () => {});

describe('<TableFilter/>', () => {
  it('should be rendered', () => {
    const wrapper = renderElement();
    expect(wrapper.find('.mat-table-filter').length).toBe(1);
  });

  xit('should be on All by default', () => {});
  xit('should filter table', () => {})
});


function renderElement() {
  return shallow(<TableFilter />)
}
