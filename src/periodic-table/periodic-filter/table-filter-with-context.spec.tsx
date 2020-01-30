import { mount } from "enzyme";
import * as React from 'react';
import { TableFilter } from "./table-filter";
import { PeriodicContext } from "..";

jest.mock('./table-filter.less', () => {});
jest.mock('../periodic-table-component/periodic-table.module.less', () => {});
jest.mock('../periodic-element/periodic-element.module.less', () => {});
// TODO(chab) determine why it needs to be mocked
jest.mock('../periodic-element/standalone-periodic-element.less', () => {});
jest.mock('../periodic-element/periodic-element.detailed.less', () => {});

describe('<TableFilter/>', () => {
  it('should be rendered', () => {
    const wrapper = renderElement();
    expect(wrapper.find('.mat-table-filter').length).toBe(1);
  });
  it('once a subselector is clicked, all others should be deselected', () => {
    const wrapper = renderElement();
    wrapper.find('.current-filter-selector').at(1).simulate('click');
    expect(wrapper.find('.current-filter-selector.selected').at(0).text()).toBe("Metals");
    expect(wrapper.find('.sub-filter-selector .current-filter-selector.selected').at(1).simulate('click'));
    expect(wrapper.find('.sub-filter-selector .current-filter-selector.selected').length).toBe(1);
  });

  xit('check callbacks', () => { });
});

function renderElement() {
  // we use mount to test the rendering of the underlying elements
  return mount(<PeriodicContext>
    <TableFilter/>
  </PeriodicContext>);
}
