import { shallow } from 'enzyme';
import * as React from 'react';
import { TableFilter } from './table-filter';

describe('<TableFilter/>', () => {
  it('should be rendered', () => {
    const wrapper = renderElement();
    expect(wrapper.find('.mat-table-filter').length).toBe(1);
  });

  it('should be on All by default', () => {
    const wrapper = renderElement();
    expect(wrapper.find('.current-filter-selector.selected').text()).toBe('All');
    expect(wrapper.find('.sub-filter-selector .current-filter-selector').length).toBe(0);
  });

  it('should display subselectors', () => {
    const wrapper = renderElement();
    wrapper.find('.current-filter-selector').at(1).simulate('click');
    expect(wrapper.find('.current-filter-selector.selected').at(0).text()).toBe('Metals');
    expect(wrapper.find('.sub-filter-selector .current-filter-selector').length).toBe(7);
    expect(wrapper.find('.sub-filter-selector .current-filter-selector.selected').length).toBe(7);
  });
});

function renderElement() {
  return shallow(<TableFilter />);
}
