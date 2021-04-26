import React, { useEffect, useRef, useState } from 'react';
import { MaterialsInput } from '../../../search/MaterialsInput';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { DualRangeSlider } from '../../../search/DualRangeSlider';
import { FaCaretDown, FaCaretRight, FaRegTimesCircle } from 'react-icons/fa';
import { FilterType, Filter, FilterGroup, ActiveFilter } from '../types';
import classNames from 'classnames';
import { Select } from '../../Select';
import { CheckboxList } from '../../CheckboxList';
import { ThreeStateBooleanSelect } from '../../ThreeStateBooleanSelect';
import { TextInput } from '../../TextInput';

/**
 * Component for rendering a panel of filters that are part of a SearchUI component
 */

interface Props {
  className?: string;
}

const getActiveFilterById = (id: string, activeFilters: ActiveFilter[]) => {
  return activeFilters.find((af) => af.id === id);
};

const getActiveFilterCount = (group: FilterGroup, activeFilters: ActiveFilter[]) => {
  let count = 0;
  const activeIds = activeFilters.map((f) => f.id);
  group.filters.forEach((f) => {
    if (activeIds.indexOf(f.id) > -1) {
      f.active = true;
      count++;
    } else {
      f.active = false;
    }
  });
  return count;
};

const getGroupsByName = (groups: FilterGroup[], activeFilters: ActiveFilter[]) => {
  let groupsByName = {};
  groups.forEach((g) => {
    groupsByName[g.name] = {
      expanded: g.expanded === true ? true : false,
      activeFilterCount: getActiveFilterCount(g, activeFilters),
      filters: g.filters,
    };
  });
  return groupsByName;
};

export const SearchUIFilters: React.FC<Props> = (props) => {
  const state = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const groupRefs = useRef(new Array(state.filterGroups.length));
  const [groupsByName, setGroupsByName] = useState(
    getGroupsByName(state.filterGroups, state.activeFilters)
  );

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
          <TextInput
            debounce={1000}
            type="text"
            value={state.filterValues[f.id]}
            onChange={(v) => actions.setFilterValue(v, f.id)}
            {...f.props}
          />
        );
      case FilterType.MATERIALS_INPUT:
        return (
          <MaterialsInput
            debounce={1000}
            value={state.filterValues[f.id]}
            onChange={(v) => actions.setFilterValue(v, f.id)}
            periodicTableMode="onFocus"
            onPropsChange={(propsObject) => actions.setFilterProps(propsObject, f.id, groupId)}
            autocompleteFormulaUrl={state.autocompleteFormulaUrl}
            autocompleteApiKey={state.apiKey}
            // onFieldChange={field => actions.setFilterProps({ field }, f.id, groupId)}
            // showFieldDropdown={true}
            {...f.props}
          />
        );
      case FilterType.SLIDER:
        return (
          <DualRangeSlider
            {...f.props}
            initialValues={state.filterValues[f.id]}
            onChange={(v) => actions.setFilterValue(v, f.id)}
            onPropsChange={(propsObject) => actions.setFilterProps(propsObject, f.id, groupId)}
          />
        );
      case FilterType.SELECT_SPACEGROUP_SYMBOL:
      case FilterType.SELECT_SPACEGROUP_NUMBER:
      case FilterType.SELECT_CRYSTAL_SYSTEM:
      case FilterType.SELECT_POINTGROUP:
      case FilterType.SELECT:
        return (
          <Select
            isClearable
            {...f.props}
            menuPosition="fixed"
            value={state.filterValues[f.id]}
            onChange={(selectedOption) => {
              const value = selectedOption && selectedOption.value ? selectedOption.value : null;
              actions.setFilterValue(value, f.id);
            }}
            arbitraryProps={{ id: 'test' }}
          />
        );
      case FilterType.THREE_STATE_BOOLEAN_SELECT:
        return (
          <ThreeStateBooleanSelect
            {...f.props}
            value={state.filterValues[f.id]}
            onChange={(item) => actions.setFilterValue(item.value, f.id)}
          />
        );
      case FilterType.CHECKBOX_LIST:
        return <CheckboxList {...f.props} onChange={(v) => actions.setFilterValue(v, f.id)} />;
      default:
        null;
    }
    return null;
  };

  const renderActiveFilterCount = (count: number) => {
    if (count > 0) {
      return <span className="badge ml-2">{count} active</span>;
    } else {
      return null;
    }
  };

  const resetFilter = (id: string) => {
    const activeFilter = getActiveFilterById(id, state.activeFilters);
    if (activeFilter) {
      actions.setFilterValue(activeFilter.defaultValue, id);
    }
  };

  const toggleGroup = (groupName: string) => {
    let newGroupsByName = { ...groupsByName };
    for (const name in newGroupsByName) {
      newGroupsByName[name].expanded = groupName === name ? !newGroupsByName[name].expanded : false;
    }
    setGroupsByName(newGroupsByName);
  };

  const getUnitsComponent = (units?: string) => {
    if (units) {
      return <span className="has-text-weight-normal is-size-7"> ({units})</span>;
    } else {
      return null;
    }
  };

  useEffect(() => {
    let newGroupsByName = { ...groupsByName };
    for (const name in newGroupsByName) {
      const g = newGroupsByName[name];
      g.activeFilterCount = getActiveFilterCount(g, state.activeFilters);
    }
    setGroupsByName(newGroupsByName);
  }, [state.activeFilters]);

  /**
   * This effect will set a new groupsByName if filterGroups is changed
   * from outside of this component (e.g. when a quick search is submitted)
   */
  useEffect(() => {
    const newGroupsByName = getGroupsByName(state.filterGroups, state.activeFilters);
    setGroupsByName(newGroupsByName);
  }, [state.filterGroups]);

  return (
    <div className={props.className}>
      <div className="panel">
        <div className="panel-heading">
          <div className="level is-mobile">
            <span>Filters</span>
            <button
              data-testid="search-ui-reset-button"
              className="button"
              onClick={(e) => actions.resetFilters()}
            >
              Reset
            </button>
          </div>
        </div>
        <div data-testid="panel-block-container" className="panel-block-container">
          {state.filterGroups.map((g, i) => (
            <div
              className={classNames('panel-block', { 'is-active': groupsByName[g.name].expanded })}
              key={i}
            >
              <div className="control">
                <h3 className="panel-block-title">
                  <button
                    className={classNames('button', 'is-fullwidth')}
                    /**
                     * Using keydown event for accessibility
                     * Avoiding click event due to performance issues and collisions with mousedown
                     */
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') toggleGroup(g.name);
                    }}
                    /**
                     * Using mousedown event to prevent event order issues
                     * Periodic tables close on blur which fires before click events,
                     * causing click event to be skipped because button position changes when table is hidden
                     */
                    onMouseDown={(e) => toggleGroup(g.name)}
                    aria-expanded={groupsByName[g.name].expanded}
                    aria-controls={'filter-group-' + i}
                    id={'filter-group-button-' + i}
                    type="button"
                  >
                    <span
                      className={classNames('is-size-5', {
                        'has-opacity-70': !groupsByName[g.name].expanded,
                      })}
                    >
                      {g.name}
                      {renderActiveFilterCount(groupsByName[g.name].activeFilterCount)}
                    </span>
                    <div className="is-pulled-right">
                      {!groupsByName[g.name].expanded ? (
                        <FaCaretRight className="is-vertical-align-middle" />
                      ) : (
                        <FaCaretDown className="is-vertical-align-middle" />
                      )}
                    </div>
                  </button>
                </h3>
                <div
                  id={'filter-group-region-' + i}
                  role="region"
                  aria-labelledby={'filter-group-button-' + i}
                  ref={(el) => (groupRefs.current[i] = el)}
                  className={classNames('panel-block-children', {
                    'is-hidden': !groupsByName[g.name].expanded,
                  })}
                >
                  <div aria-hidden={!groupsByName[g.name].expanded}>
                    {g.filters.map((f, j) => (
                      <div className="mb-3" key={j}>
                        <div>
                          <p className="has-text-weight-bold mb-2">
                            {!f.active && (
                              <span>
                                {f.name}
                                {getUnitsComponent(f.units)}
                              </span>
                            )}
                            {f.active && (
                              <a onClick={() => resetFilter(f.id)}>
                                {f.name}
                                {getUnitsComponent(f.units)}
                                <FaRegTimesCircle className="ml-2 is-vertical-align-middle" />
                              </a>
                            )}
                          </p>
                          {renderFilter(f, g.name)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
// onClick={(v, id) => actions.setFilterValue(v, id)}
