import * as React from "react";
import "./periodic-table.module.less";
import { DISPLAY_MODE, PeriodicElement } from "../periodic-element/periodic-element.component";
import { useDetailedElement } from "../periodic-table-state/table-store";
import { MatElement, TABLE_DICO_V2, TABLE_V2 } from "../table-v2";
import { useMediaQuery } from 'react-responsive';


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
}

export enum TableLayout {
  SPACED = 'spaced',
  COMPACT = 'compact',
  MINI = 'small'
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

export function Table({disabledElement, enabledElement, hiddenElement, onElementClicked, onElementHovered}: TableProps) {
  const [isShown,setIsShown] = React.useState(true);
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  console.log('hidden', hiddenElement);

  return (
    <div className={`table-container ${getLayout(isDesktop, isTablet, isMobile)} ${isShown ? '' : 'elements-hidden'}`}>
      <TableSpacer onTableSwitcherClicked={ () => setIsShown(!isShown)}/>
      {TABLE_V2.map((element: MatElement) =>
          <PeriodicElement
            onElementHovered={(element) => onElementHovered(element)}
            onElementClicked={(element) => onElementClicked(element) }
            key={`${element.symbol}--${element.number}`}
            hidden = {hiddenElement[element.symbol]}
            disabled={disabledElement[element.symbol]}
            enabled={enabledElement[element.symbol]}
            element={element}/>
      )}
    </div>)
}

function getLayout(isDesktop: boolean, isTablet: boolean, isMobile: boolean) {
  if (isDesktop) { return TableLayout.SPACED}
  if (isTablet) { return TableLayout.COMPACT}
  if (isMobile) { return TableLayout.MINI}
  return TableLayout.SPACED;
}


