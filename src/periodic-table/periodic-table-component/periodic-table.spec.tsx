import { mount } from "enzyme";
import { Table, TableLayout } from "./periodic-table.component";
import * as React from "react";

// JEST does not know how to handle LESS, so we simply mock the CSS an empty file.
// If we are going to use JSDOM, and check width/height/stuff, we'll need to find a way
jest.mock('./periodic-table.module.less', () => {});
jest.mock('../periodic-element/periodic-element.module.less', () => {});
jest.mock('../periodic-element/periodic-element.detailed.less', () => {});

const enabled = {H: true, Li: true};

describe('<Table/>', () => {

  it('should be rendered', () => {
    const wrapper = renderElement(enabled, {...enabled});
    expect(wrapper.find('.table-container').length).toBe(1);
    expect(wrapper.find('.mat-element').length).toBe(120);
  });
  it('should have correct enabled state', () => {
    const wrapper = renderElement({}, enabled);
    expect(wrapper.find('.mat-element').at(0).hasClass('enabled')).toBe(true);
    expect(wrapper.find('.mat-element').at(1).hasClass('enabled')).toBe(false);
    expect(wrapper.find('.mat-element').at(2).hasClass('enabled')).toBe(true);
  });
  it('should have correct disabled state', () => {
    const wrapper = renderElement({...enabled});
    expect(wrapper.find('.mat-element').at(0).hasClass('disabled')).toBe(true);
    expect(wrapper.find('.mat-element').at(1).hasClass('enabled')).toBe(false);
    expect(wrapper.find('.mat-element').at(2).hasClass('disabled')).toBe(true);
  });
  it('should have correct hidden state', () => {
    const wrapper = renderElement({}, {}, {...enabled});
    expect(wrapper.find('.mat-element').at(0).hasClass('hidden')).toBe(true);
    expect(wrapper.find('.mat-element').at(1).hasClass('hidden')).toBe(false);
    expect(wrapper.find('.mat-element').at(2).hasClass('hidden')).toBe(true);
  });

  //TODO(layout/callback/detailed)
  xit('click callback should be called', ()=> {});
  xit('check the class of the layout', () => {})
});

export function renderElement(disabled = {},
                       enabled = {},
                       hidden = {},
                       onClick = () => {},
                       onHover = () => {},
                       heatmap = {},
                       min?: string,
                       max?: string) {
  // we use mount to test the rendering of the underlying elements
  return mount(<Table enabledElement={enabled}
                        disabledElement={disabled}
                        onElementHovered={onHover}
                        forceTableLayout={TableLayout.SPACED}
                        hiddenElement={hidden}
                        heatmap={heatmap}
                        heatmapMin={min}
                        heatmapMax={max}
                        onElementClicked={onClick} />);

}

