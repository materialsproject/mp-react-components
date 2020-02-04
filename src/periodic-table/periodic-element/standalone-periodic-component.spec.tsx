import { shallow } from 'enzyme';
import * as React from 'react';
import { TABLE_DICO_V2 } from "../periodic-table-data/table-v2";
import { StandalonePeriodicComponent } from "./standalone-periodic-component";

// JEST does not know how to handle LESS, so we simply mock the CSS an empty file.
// If we are going to use JSDOM, and check width/height/stuff, we'll need to find a way
jest.mock('./periodic-element.module.less', () => {});
jest.mock('./periodic-element.detailed.less', () => {});
jest.mock('./standalone-periodic-element.less', () => {});

describe('<StandalonePeriodicElement/>', () => {
  it('should be rendered', () => {
    const wrapper = renderElement();
    expect(wrapper.find('.mp-element-wrapper').length).toBe(1);
  });
  xit('should have a correct size', () => {});
});


const TEST_ELEMENT = TABLE_DICO_V2['H'];

function renderElement(disabled = false,
                       enabled = false,
                       onClick = () => {},
                       element = TEST_ELEMENT
) {
  return shallow(<StandalonePeriodicComponent
    disabled={disabled}
    enabled={enabled}
    size={20}
    hidden={false}
    element={element}
    onElementHovered={onClick}
    onElementClicked={onClick}/>)
}
