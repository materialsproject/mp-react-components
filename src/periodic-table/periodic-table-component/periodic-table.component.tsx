import * as React from "react";
import "./periodic-table.module.less";
import { DISPLAY_MODE, PeriodicElement } from "../periodic-element/periodic-element.component";
import { useDetailedElement } from "../periodic-table-state/table-store";
import { MatElement, TABLE_DICO_V2, TABLE_V2 } from "../periodic-table-data/table-v2";
import { useMediaQuery } from 'react-responsive';
import { useMemo } from "react";
import { extent, range, max, min } from 'd3-array';
import { scaleLinear, scaleSequential } from 'd3-scale';
import * as d3Scale from 'd3-scale-chromatic';


export const DEFAULT_HEATMAP_COLOR = '#EDEEED';

export const COLORSCHEME = {
  'Viridis' : d3Scale.interpolateViridis,
  'Turbo': d3Scale.interpolateTurbo,
  'CubeHelix': d3Scale.interpolateCubehelixDefault,
  'Cividis': d3Scale.interpolateCividis,
  'Inferno': d3Scale.interpolateInferno,
  'Blues': d3Scale.interpolateBlues,
  'Oranges': d3Scale.interpolateOranges,
  'Greens': d3Scale.interpolateGreens,
  'Reds': d3Scale.interpolateReds,
  'Purples': d3Scale.interpolatePurples
};
Object.freeze(COLORSCHEME);


export interface TableProps {
  /** dictionnary of disabled elements */
  disabledElement: {[symbol:string]: boolean};
  /** dictionnary of enabled elements  */
  enabledElement: {[symbol:string]: boolean};
  /** dictonnary of hidden elements */
  hiddenElement: {[symbol:string]: boolean}
  /** Callback who gets called once the user clicked an element; the clicked element is passed **/
  onElementClicked: (mat: MatElement) => void;
  onElementHovered: (mat: MatElement) => void;
  /** Force the layout of the table **/
  forceTableLayout?: TableLayout
  /** Colorize the table by using an heatmap
   *  id: symbol of the element
   *  value: value used for the heatmap
   **/
  heatmap?: {[id: string]: number},
  /** Color scheme to use. Look at the COLORSCHEME definition for available color scheme
   *  If you pass an unknown color scheme or no scheme, the component will use a linear scale whose range
   *  is defined by the heatmapMax and heatmapMin value
   **/
  colorScheme?: keyof typeof COLORSCHEME;
  /** Color used for the highest value */
  heatmapMax?: string,
  /** Color used for the lowest value*/
  heatmapMin?: string

}

export enum TableLayout {
  SPACED = 'spaced',
  COMPACT = 'compact',
  MINI = 'small',
  MAP = 'map',
}

const N_LEGEND_ITEMS = 10;

function computeHeatmap(h: any, max: string, min: string, scheme: keyof typeof COLORSCHEME) {
  if (!h) return {linearScale: null, legendScale: null};

  const heatmapExtent = extent(Object.values(h));
  const legendPosition = scaleLinear().domain(heatmapExtent).range([0, 100]);

  if (COLORSCHEME[scheme]) {
    return {
      linearScale: scaleSequential(COLORSCHEME[scheme]).domain(heatmapExtent),
      legendScale: scaleSequential(COLORSCHEME[scheme]).domain([0, N_LEGEND_ITEMS]),
      legendPosition
    }
  }

  const linearScale = scaleLinear().range([min,max]);
  linearScale.domain(heatmapExtent);

  const legendScale = scaleLinear().range([min, max]).domain([0, N_LEGEND_ITEMS]);

  return {linearScale, legendScale, legendPosition};
}

// Ultimately, we'll allow people to pass a specific component by using render props
// the goal is to allow people to insert whatever you want there
export function TableSpacer({onTableSwitcherClicked}: any) {

  const detailedElement = useDetailedElement();

  return (<React.Fragment>
    <div className="first-span">
      <div className="table-switcher" onClick={onTableSwitcherClicked}></div>
      <div className="input-container">
      </div>
    </div>
    <div className="second-span">
    </div>
    <div className="element-description">
      {
        detailedElement &&
        <PeriodicElement
          displayMode={DISPLAY_MODE.DETAILED}
          disabled={false}
          enabled={false}
          hidden={false}
          color={undefined}
          element={TABLE_DICO_V2[detailedElement]}/>
      }
    </div>
    <div className="separator-span"></div>
    <div className="first-lower-span"></div>
    <div className="second-lower-span"></div>
  </React.Fragment>);
}

export function Table({disabledElement,
                        enabledElement,
                        hiddenElement,
                        onElementClicked,
                        onElementHovered,
                        forceTableLayout,
                        heatmap,
                        heatmapMax,
                        heatmapMin,
                        colorScheme}: TableProps) {
  const [isShown,setIsShown] = React.useState(true);
  const [legendPosition, setLegendPosition] = React.useState(-1);
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // we consider that either those properties are all defined, or not
  const {linearScale: heatmapscale, legendScale, legendPosition: legendPositionScale} =
    useMemo(() => computeHeatmap(heatmap!, heatmapMax!, heatmapMin!, colorScheme!),
    [heatmapMax, heatmapMin, heatmap, colorScheme]);

  // TODO(chab) allow people to pass the number of subdivisions OR to have a continuous legend
  const legendItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  const onHover = (element: MatElement) => {
    if (!hasHeatmap(heatmap)) {
      onElementHovered(element);
      return;
    }
    const value = heatmap![element.symbol];
    if (!value) {
      setLegendPosition(-1);
    } else {
      const legendPosition = legendPositionScale(value);
     setLegendPosition(legendPosition);
    }
    onElementHovered(element);
  };

  return (
    <div className={'table-legend-container'}>
      <div className={`table-container ${getLayout(isDesktop, isTablet, isMobile, forceTableLayout)} ${isShown ? '' : 'elements-hidden'}`}>
        <TableSpacer onTableSwitcherClicked={ () => setIsShown(!isShown)}/>
        {TABLE_V2.map((element: MatElement) =>
          <PeriodicElement
            onElementHovered={(element) => onHover(element)}
            onElementClicked={(element) => onElementClicked(element)}
            color={ hasHeatmap(heatmap)
              ? ( heatmap![element.symbol] ? heatmapscale(heatmap![element.symbol]) : DEFAULT_HEATMAP_COLOR) // TODO(maybe arbitrary color ?)
              : null}
            key={`${element.symbol}--${element.number}`}
            hidden = {hiddenElement[element.symbol]}
            disabled={disabledElement[element.symbol]}
            enabled={enabledElement[element.symbol]}
            element={element}/>
        )}
      </div>
      {hasHeatmap(heatmap) && <div className={'legend-container'}>
        <div className={'table-legend'}>
          {legendItems.map(n =>
            <div key={`legend${n}`}
                 className={'legend-division'}
                 style={{'background': legendScale(n), width: '10px', height: `${100/ legendItems.length}%`}}> </div>
          )}
          <div className={'table-legend-pointer'}
            style={{position:'absolute', width:'12px', height:'2px',
            right:'-1px',
            top:`${legendPosition}%`,
            background:'black'}}>
          </div>
        </div>
      </div>}
    </div>)
}

function getLayout(isDesktop: boolean, isTablet: boolean, isMobile: boolean, tableLayout?: TableLayout ) {
  if (tableLayout) return tableLayout;
  if (isDesktop) { return TableLayout.SPACED}
  if (isTablet) { return TableLayout.COMPACT}
  if (isMobile) { return TableLayout.MINI}
  return TableLayout.SPACED;
}

function hasHeatmap(heatmap): boolean {
  return !!heatmap && Object.keys(heatmap).length > 0;
}

