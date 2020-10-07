import React, { useState, useEffect } from 'react';
import { PeriodicContext } from '../periodic-table/periodic-table-state/periodic-selection-context';
import { SelectableTable } from '../periodic-table/table-state';
import { TableLayout } from '../periodic-table/periodic-table-component/periodic-table.component';
import { ElementsInput } from './ElementsInput/ElementsInput';
import {
  useMaterialsSearchContext,
  useMaterialsSearchContextActions
} from './MaterialsSearchProvider';
import { Button } from 'react-bulma-components';
import { DualSlider } from './sliders/dual-slider';
import { DualRangeSlider } from './DualRangeSlider';
import { AiFillCaretDown, AiFillCaretRight, AiOutlineEllipsis } from 'react-icons/ai';
import { FaCaretDown, FaCaretRight, FaEllipsisV } from 'react-icons/fa';
import { Dropdown } from 'react-bulma-components';
import { FilterType } from './MaterialsSearchConstants';

interface Props {
  className?: string;
}

export const SearchFilters: React.FC<Props> = props => {
  const state = useMaterialsSearchContext();
  const actions = useMaterialsSearchContextActions();
  const [menuOpen, setMenuOpen] = useState(false);

  const renderFilter = (f, groupId) => {
    switch (f.type) {
      case FilterType.ELEMENTS_INPUT:
        return (
          <PeriodicContext>
            <ElementsInput
              {...f.props}
              value={state.values[f.id]}
              onChange={v => actions.setFilterValue(v, f.id)}
              onPropsChange={p => actions.setFilterProps(p, f.id, groupId)}
            />
            <SelectableTable
              maxElementSelectable={20}
              forceTableLayout={TableLayout.MINI}
              hiddenElements={[]}
              onStateChange={enabledElements => {
                Object.keys(enabledElements).filter(el => enabledElements[el]);
              }}
              enabledElements={[]}
              disabledElements={['H', 'C']}
            />
          </PeriodicContext>
        );
      case FilterType.SLIDER:
        return (
          <div>
            <p className="mb-2">{f.name}</p>
            <DualRangeSlider
              {...f.props}
              values={state.values[f.id]}
              onChange={v => actions.setFilterValue(v, f.id)}
            />
          </div>
        );
      default:
        null;
    }
    return null;
  };

  return (
    <div className={props.className}>
      <div className="panel">
        <div className="panel-heading">
          <div className="level">
            <span>Filters</span>
            <Dropdown className="mp-dropdown" value="" label={<FaEllipsisV />} right={true}>
              <Dropdown.Item value="reset">
                <p onClick={e => actions.reset()}>Reset filters</p>
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        {state.groups.map((g, i) => (
          <div className="panel-block" style={{ padding: '1em' }} key={i}>
            <div className="control">
              <div className="is-clickable" onClick={() => actions.toggleGroup(g.name)}>
                <span className="title is-5">{g.name}</span>
                <div className="is-pulled-right">
                  {g.collapsed ? <FaCaretRight /> : <FaCaretDown />}
                </div>
              </div>
              <div className={`mt-3 ${g.collapsed ? 'is-hidden' : ''}`}>
                {g.filters.map((f, j) => (
                  <div key={j}>{renderFilter(f, g.name)}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
