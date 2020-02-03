import { color } from 'd3-color'
import { renderElement } from "./periodic-table.spec";

// JEST does not know how to handle LESS, so we simply mock the CSS an empty file.
// If we are going to use JSDOM, and check width/height/stuff, we'll need to find a way
jest.mock('./periodic-table.module.less', () => {});
jest.mock('../periodic-element/periodic-element.module.less', () => {});
jest.mock('../periodic-element/periodic-element.detailed.less', () => {});

const heatmap = { 'H': 3, 'O':1, 'F': 5}; // 1 // 7 // 8ß
const min = '#000000';
const max = '#FFFFFF';

type Parameters<T> = T extends (... args: infer T) => any ? T : never;
const defaultOpts: Parameters<typeof renderElement> = [
  {}, {}, {}, () => {}, () => {}, heatmap, min, max
];
let wrapper;

describe('<Table/>', () => {

  beforeAll(() => {
    wrapper = renderElement(...defaultOpts);
  });

  it('should not render a legend, if nothing is passed', () => {
    const opts = [...defaultOpts];
    opts[5] = undefined;
    wrapper = renderElement(opts);
    checkForNoLegend();
  });

  it('should not render a legend, if legend has no keys', () => {
    const opts = [...defaultOpts];
    opts[5] = {};
    wrapper = renderElement(opts);
    checkForNoLegend();
  });

  it('should render a legend, if an heatmap is passed', () => {
    wrapper = renderElement(...defaultOpts);
    expect(wrapper.find('.table-legend-container').length).toBe(1);
    expect(wrapper.find('.legend-container').length).toBe(1);
    expect(wrapper.find('.table-legend').length).toBe(1);
    expect(wrapper.find('.table-legend-pointer').length).toBe(1);

  });

  it('legend should have correct min/max, and 14 items', () => {
    expect(wrapper.find('.legend-division').length).toBe(15);
    checkLegendColor(0 ,min);
    checkLegendColor(14, max);
    checkLegendColor(7, '#B3B3B3');

  });

  it('min elements should have the correct color', () => {
    // Note (chab) at returns a wrapper, get returns the react element
    const oxygenNode = wrapper.find('.mat-element').get(7);
    checkNodeColor(oxygenNode, min);
  });

  it('max elements should have the correct color', () => {
    const fNode = wrapper.find('.mat-element').get(8);
    checkNodeColor(fNode, max);
  });

  it('median element should have the correct color', () => {
    const fNode = (wrapper.find('.mat-element').get(0));
    checkNodeColor(fNode, '#808080');
  });

  it('items that are not in the heatmap should have their default color', () => {
    const fNode = (wrapper.find('.mat-element').get(12));
    expect(fNode.props.style).toEqual({})
  });

  it('should position the legend marker when hovering, min/max/median', () => {
    hoverAtElementIndex(0); // median
    let legendPointer = wrapper.find('.table-legend-pointer');
    expect(legendPointer.props().style.top).toBe('50%');
    hoverAtElementIndex(7); // median
    legendPointer = wrapper.find('.table-legend-pointer');
    expect(legendPointer.props().style.top).toBe('0%');
    hoverAtElementIndex(8); // median
    legendPointer = wrapper.find('.table-legend-pointer');
    expect(legendPointer.props().style.top).toBe('100%');
  });

});

function hoverAtElementIndex(elementIndex) {
  wrapper.find('.mat-element').at(elementIndex).simulate('mouseover');
}

function checkLegendColor(legendItem, hexColorString) {
  checkNodeColor(wrapper.find('.legend-division').get(legendItem), hexColorString);
}

function checkNodeColor({props:{style}}, hexColorString) {
  expect(style).toHaveProperty('background', color(hexColorString).toString());
}

function checkForNoLegend() {
  expect(wrapper.find('.table-legend-container').length).toBe(1);
  expect(wrapper.find('.legend-container').length).toBe(0);
  expect(wrapper.find('.table-legend').length).toBe(0);
  expect(wrapper.find('.table-legend-pointer').length).toBe(0);
}
