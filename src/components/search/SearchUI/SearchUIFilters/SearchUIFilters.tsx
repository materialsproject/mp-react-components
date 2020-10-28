import React from 'react';
import { MaterialsInput } from '../../../search/MaterialsInput';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { DualRangeSlider } from '../../../search/DualRangeSlider';
import { FaCaretDown, FaCaretRight, FaEllipsisV } from 'react-icons/fa';
import { Dropdown } from 'react-bulma-components';
import { FilterType, Filter } from '../constants';
import { Form } from 'react-bulma-components';

/**
 * Component for rendering a panel of filters that are part of a SearchUI component
 */

interface Props {
  className?: string;
}

export const SearchUIFilters: React.FC<Props> = props => {
  const state = useSearchUIContext();
  const actions = useSearchUIContextActions();

  /**
   * Render filter component based on the filter's "type" property
   * Accepts the full filter object as an argument to render components
   * The groupId argument is used for components that need to
   * dynamically change their "props" property with actions.setFilterProps().
   */
  const renderFilter = (f: Filter, groupId: string) => {
    switch (f.type) {
      case FilterType.TEXT_INPUT:
        return (
          <div>
            <p className="has-text-weight-bold mb-1">{f.name}</p>
            <Form.Input
              {...f.props}
              type="text"
              value={state.filterValues[f.id]}
              onChange={e => actions.setFilterValue(e.target.value, f.id)}
            />
          </div>
        );
      case FilterType.MATERIALS_INPUT:
        return (
          <div>
            <p className="has-text-weight-bold mb-1">{f.name}</p>
            <MaterialsInput
              {...f.props}
              value={state.filterValues[f.id]}
              onChange={v => actions.setFilterValue(v, f.id)}
              onParsedValueChange={parsedValue =>
                actions.setFilterProps({ parsedValue }, f.id, groupId)
              }
              periodicTableMode="onFocus"
              onFieldChange={field => actions.setFilterProps({ field }, f.id, groupId)}
            />
          </div>
        );
      case FilterType.SLIDER:
        return (
          <div>
            <p className="has-text-weight-bold mb-3">{f.name}</p>
            <DualRangeSlider
              {...f.props}
              values={state.filterValues[f.id]}
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
                <p onClick={e => actions.resetFilters()}>Reset filters</p>
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        <div className="panel-block-container">
          {state.filterGroups.map((g, i) => (
            <div className="panel-block" style={{ padding: '1em' }} key={i}>
              <div className="control">
                <div
                  className="panel-block-title is-clickable"
                  onClick={() => actions.toggleGroup(g.name)}
                >
                  <span className="is-size-5">{g.name}</span>
                  <div className="is-pulled-right">
                    {g.collapsed ? <FaCaretRight /> : <FaCaretDown />}
                  </div>
                </div>
                <div className={`panel-block-children ${g.collapsed ? 'is-hidden' : ''}`}>
                  {g.filters.map((f, j) => (
                    <div className="mb-2" key={j}>
                      {renderFilter(f, g.name)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
