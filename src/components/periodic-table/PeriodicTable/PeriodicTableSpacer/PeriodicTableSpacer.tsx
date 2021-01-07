import React from 'react';
import { DISPLAY_MODE, PeriodicElement } from '../../periodic-element/periodic-element.component';
import { TABLE_DICO_V2 } from '../../periodic-table-data/table-v2';
import { useDetailedElement } from '../../periodic-table-state/table-store';

// Ultimately, we'll allow people to pass a specific component by using render props
// the goal is to allow people to insert whatever you want there
interface Props {
  plugin?: JSX.Element;
  disabled?: boolean;
}

export const PeriodicTableSpacer: React.FC<Props> = (props) => {
  const detailedElement = useDetailedElement();
  let pluginComponent = props.plugin;

  if (props.disabled || !props.plugin) {
    pluginComponent = (
      <>
        <div className="first-span"></div>
        <div className="second-span"></div>
      </>
    );
  }
  return (
    <React.Fragment>
      {/* <div className="first-span">
        {showSwitcher && <div className="table-switcher" onClick={onTableSwitcherClicked}></div>}
        <div className="input-container"></div>
      </div>
      <div className="second-span">
        {!disabled && (selectorWidget)}
      </div> */}
      {pluginComponent}
      <div className="element-description">
        {detailedElement && (
          <PeriodicElement
            displayMode={DISPLAY_MODE.DETAILED}
            disabled={false}
            enabled={false}
            hidden={false}
            color={undefined}
            element={TABLE_DICO_V2[detailedElement]}
          />
        )}
      </div>
      <div className="separator-span"></div>
      <div className="first-lower-span"></div>
      <div className="second-lower-span"></div>
    </React.Fragment>
  );
};
