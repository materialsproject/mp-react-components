import * as React from "react";
import "./periodic-table.module.less";
import { DISPLAY_MODE, PeriodicElement } from "../periodic-element/periodic-element.component";
import { useDetailedElement } from "../periodic-table-state/table-store";
import { MatElement, TABLE_DICO_V2, TABLE_V2 } from "../periodic-table-data/table-v2";
import { useMediaQuery } from 'react-responsive';
import { useEffect, useMemo, useState } from "react";
import { extent, range, max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';



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
  /** Colorize the table by using an heatmap **/
  heatmap?: {[id: string]: number},
  heatmapMax?: string,
  heatmapMin?: string
}

export enum TableLayout {
  SPACED = 'spaced',
  COMPACT = 'compact',
  MINI = 'small',
  MAP = 'map',
}

const N_LEGEND_ITEMS = 10;

function computeHeatmap(h: any, max: string, min: string) {
  if (!h) return {linearScale: null, legendScale: null};

  const heatmapExtent = extent(Object.values(h));
  const linearScale = scaleLinear().range([min,max]);
  linearScale.domain(heatmapExtent);

  const legendScale = scaleLinear().range([min, max]).domain([0, N_LEGEND_ITEMS]);
  const legendPosition = scaleLinear().domain(heatmapExtent).range([0, 100]);
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
          element={TABLE_DICO_V2[detailedElement]}
          onElementClicked={()=>{}}
          onElementHovered={()=>{}}/>
      }
    </div>
    <div className="separator-span"></div>
    <div className="first-lower-span"></div>
    <div className="second-lower-span"></div>
  </React.Fragment>);
}

export function Table({disabledElement, enabledElement, hiddenElement, onElementClicked, onElementHovered, forceTableLayout, heatmap, heatmapMax, heatmapMin}: TableProps) {
  const [isShown,setIsShown] = React.useState(true);
  const [legendPosition, setLegendPosition] = React.useState(-1);
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // we consider that either those properties are all defined, or not
  const {linearScale: heatmapscale, legendScale, legendPosition: legendPositionScale}= useMemo(() => computeHeatmap(heatmap!, heatmapMax!, heatmapMin!),
    [heatmapMax, heatmapMin, heatmap]);
  const legendItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  const onHover = (element: MatElement) => {
    if (!heatmap) {
      return;
    }
    const value = heatmap[element.symbol];
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
            color={heatmapscale ? heatmapscale(heatmap![element.symbol]) : null}
            key={`${element.symbol}--${element.number}`}
            hidden = {hiddenElement[element.symbol]}
            disabled={disabledElement[element.symbol]}
            enabled={enabledElement[element.symbol]}
            element={element}/>
        )}
      </div>
      {heatmap && <div className={'table-legend-container'}>
        <div className={'table-legend'}>
          {legendItems.map(n =>
            <div key={`legend${n}`} style={{'background': legendScale(n), width: '10px', height: `${100/ legendItems.length}%`}}> </div>
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


