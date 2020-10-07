import { shallow } from 'enzyme';
import { DISPLAY_MODE, PeriodicElement } from './periodic-element.component';
import * as React from 'react'; // for some reasons, uppercase does not work on Docker
import { MatElement, TABLE_DICO_V2 } from '../periodic-table-data/table-v2';

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
  it('click callback shoud be called', () => {
    const mockCallBack = jest.fn();
    const wrapper = renderElement(true, false, mockCallBack);
    wrapper.find('.mat-element').simulate('click');
    expect(mockCallBack).toHaveBeenCalledTimes(1);
  });
  it('should render advanced display mode', () => {
    const wrapper = renderElement(true, false, () => {}, TEST_ELEMENT, DISPLAY_MODE.DETAILED);
    expect(wrapper.find('.main-panel').length).toBe(1);
  });
  it('should render shells', () => {
    //TODO(chab) actually tested in an integration test, see table-state.spec.tsx, but should be unit tested here
    const wrapper = renderElement(true, false, () => {}, TEST_ELEMENT, DISPLAY_MODE.DETAILED);
    expect(wrapper.find('.mat-side-panel').length).toBe(1);
  });
  it('should accept strings', () => {
    const wrapper = renderElement(false, false, () => {}, 'O');
    expect(wrapper.find('.mat-element').length).toBe(1);
    expect(wrapper.find('.mat-element').hasClass('disabled')).toBe(false);
    expect(wrapper.find('.mat-element').hasClass('enabled')).toBe(false);
  });

  it('return an empty div, if an incorrect el is passed', () => {
    const wrapper = renderElement(false, false, () => {}, 'dsfdff');
    expect(wrapper.find('.mat-element').length).toBe(0);
  });
});

const TEST_ELEMENT = TABLE_DICO_V2['H'];

function renderElement(
  disabled = false,
  enabled = false,
  onClick = () => {},
  element: MatElement | string = TEST_ELEMENT,
  display = DISPLAY_MODE.SIMPLE
) {
  return shallow(
    <PeriodicElement
      disabled={disabled}
      enabled={enabled}
      hidden={false}
      element={element}
      onElementHovered={onClick}
      displayMode={display}
      onElementClicked={onClick}
    />
  );
}
