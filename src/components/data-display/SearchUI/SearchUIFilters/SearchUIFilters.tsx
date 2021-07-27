import React, { useEffect, useRef, useState } from 'react';
import { MaterialsInput } from '../../../data-entry/MaterialsInput';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { DualRangeSlider } from '../../../data-entry/DualRangeSlider';
import { FaCaretDown, FaCaretRight, FaRegTimesCircle } from 'react-icons/fa';
import { FilterType, Filter, FilterGroup, ActiveFilter } from '../types';
import classNames from 'classnames';
import { Select } from '../../../data-entry/Select';
import { CheckboxList } from '../../../data-entry/CheckboxList';
import { ThreeStateBooleanSelect } from '../../../data-entry/ThreeStateBooleanSelect';
import { TextInput } from '../../../data-entry/TextInput';
import { Tooltip } from '../../Tooltip';

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
      ...g,
      expanded: g.expanded === true || g.alwaysExpanded === true ? true : false,
      activeFilterCount: getActiveFilterCount(g, activeFilters)
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
            periodicTableMode="focus"
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
            debounce={1000}
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
      return <span className="tag is-link is-rounded ml-2">{count} active</span>;
    } else {
      return null;
    }
  };

  const renderCaret = (group: FilterGroup) => {
    if (group.alwaysExpanded) {
      return null;
    } else if (group.expanded) {
      return <FaCaretDown className="filter-group-caret" />;
    } else {
      return <FaCaretRight className="filter-group-caret" />;
    }
  };

  const renderUnitsComponent = (units?: string) => {
    if (units) {
      return <span className="has-text-weight-normal is-size-7"> ({units})</span>;
    } else {
      return null;
    }
  };

  const renderFilterLabel = (filter: Filter) => {
    const cancelButton = filter.active ? (
      <FaRegTimesCircle className="ml-2 filter-cancel-button" />
    ) : null;
    const innerLabel = (
      <span
        className={classNames('has-text-weight-bold', 'mb-2', {
          'tooltip-label': filter.tooltip
        })}
        data-tip
        data-for={`filter_${filter.id}`}
      >
        {filter.name}
        {renderUnitsComponent(filter.units)}
        {cancelButton}
        {filter.tooltip && <Tooltip id={`filter_${filter.id}`}>{filter.tooltip}</Tooltip>}
      </span>
    );

    if (filter.active) {
      return <a onClick={() => resetFilter(filter.id)}>{innerLabel}</a>;
    } else {
      return innerLabel;
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
      if (newGroupsByName[name].alwaysExpanded) {
        newGroupsByName[name].expanded = true;
      } else if (groupName === name) {
        newGroupsByName[name].expanded = !newGroupsByName[name].expanded;
      } else {
        newGroupsByName[name].expanded = false;
      }
    }
    setGroupsByName(newGroupsByName);
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
                    <span className="mr-4">{renderCaret(groupsByName[g.name])}</span>
                    <span
                      className={classNames('is-size-5', {
                        'has-opacity-70': !groupsByName[g.name].expanded
                      })}
                    >
                      {g.name}
                      {renderActiveFilterCount(groupsByName[g.name].activeFilterCount)}
                    </span>
                  </button>
                </h3>
                <div
                  id={'filter-group-region-' + i}
                  role="region"
                  aria-labelledby={'filter-group-button-' + i}
                  ref={(el) => (groupRefs.current[i] = el)}
                  className={classNames('panel-block-children', {
                    'is-hidden': !groupsByName[g.name].expanded
                  })}
                >
                  <div aria-hidden={!groupsByName[g.name].expanded}>
                    {g.filters.map((f, j) => (
                      <div className="mb-3" key={j}>
                        <div>
                          <div className="has-text-weight-bold mb-2">{renderFilterLabel(f)}</div>
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
