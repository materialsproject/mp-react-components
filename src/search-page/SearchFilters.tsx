import React, { useState, useEffect } from 'react';
import { PeriodicContext } from '../periodic-table/periodic-table-state/periodic-selection-context';
import { SelectableTable } from '../periodic-table/table-state';
import { TableLayout } from '../periodic-table/periodic-table-component/periodic-table.component';
import { ElementsInput } from './ElementsInput/ElementsInput';
import { useMaterialsSearch } from './MaterialsSearchProvider';
import { Button } from 'react-bulma-components';
import { DualSlider } from './sliders/dual-slider';
import { DualRangeSlider } from './DualRangeSlider';

interface Props {
  className: string
}

export const SearchFilters: React.FC<Props> = (props) => {
  const { state, actions } = useMaterialsSearch();
  // const [values, setValues] = useState([10, 50]);
  
  function onSliderChange(values: ReadonlyArray<number>) {
    console.log(values);
    console.log(state.volume.values);
    actions.setVolumeFilter({values: values});
  }

  return (
    <div className={props.className}>
      <div>
        <div>
          <PeriodicContext>
              <ElementsInput />
              <SelectableTable
                maxElementSelectable={20}
                forceTableLayout={TableLayout.MINI}
                hiddenElements={[]}
                onStateChange={enabledElements => {
                  Object.keys(enabledElements).filter(el => enabledElements[el]);
                }}
                enabledElements={['Co']}
                disabledElements={['H', 'C']}
              />
          </PeriodicContext>
        </div>
        <div>
          {state.filters.map((filter, i) => {
            return (
              <div key={i}>
                {state.filters[i].value?.toString()}
                <DualRangeSlider {...filter.props} values={filter.value} onChange={v => actions.setFilterValue(v, filter.id)}/>
              </div>
            )
          })}
          {/* <DualRangeSlider {...state.volume} onChange={onSliderChange}/> */}
        </div>
      </div>
      <div style={{marginTop: '15px'}}>
        <Button onClick={actions.getData} className="is-primary" style={{marginRight: '5px'}}>Apply</Button>
        <Button onClick={actions.reset}>Reset</Button>
      </div>
    </div>
  );
}