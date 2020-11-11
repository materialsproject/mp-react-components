import React, { useEffect, useRef, useState } from 'react';
import { MaterialsInput } from '../../../search/MaterialsInput';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { DualRangeSlider } from '../../../search/DualRangeSlider';
import { FaCaretDown, FaCaretRight, FaEllipsisV } from 'react-icons/fa';
import { Dropdown } from 'react-bulma-components';
import { FilterType, Filter, FilterGroup, ActiveFilter } from '../constants';
import { Form } from 'react-bulma-components';
import classNames from 'classnames';
import { Select } from '../../Select';
import { CheckboxList } from '../../CheckboxList';
import { ThreeStateBooleanSelect } from '../../ThreeStateBooleanSelect'
import { initArray } from '../../utils';
import { TextInput } from '../../TextInput';

/**
 * Component for rendering a panel of filters that are part of a SearchUI component
 */

interface Props {
  className?: string;
}

const getActiveFilterCount = (group: FilterGroup, activeFilters: ActiveFilter[]) => {
  let count = 0;
  const activeIds = activeFilters.map(f => f.id);
  group.filters.forEach((f) => {
    if (activeIds.indexOf(f.id) > -1) count++;
  });
  return count;
};

const getGroupsByName = (groups: FilterGroup[], activeFilters: ActiveFilter[]) => {
  let groupsByName = {};
  groups.forEach((g) => {
    groupsByName[g.name] = {
      expanded: false,
      activeFilterCount: getActiveFilterCount(g, activeFilters),
      filters: g.filters
    };
  });
  return groupsByName;
}

export const SearchUIFilters: React.FC<Props> = props => {
  const state = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const groupRefs = useRef(new Array(state.filterGroups.length));
  const [expandedGroupsByIndex, setExpandedGroupsByIndex] = useState(initArray(state.filterGroups.length, false));
  const [groupsByName, setGroupsByName] = useState(getGroupsByName(state.filterGroups, state.activeFilters));
  const [expandedGroupIndex, setExpandedGroupIndex] = useState<number | null>(null);
  const [clicked, setClicked] = useState(false);

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
            <TextInput
              debounce={1000}
              type="text"
              value={state.filterValues[f.id]}
              onChange={v => actions.setFilterValue(v, f.id)}
              {...f.props}
            />
          </div>
        );
      case FilterType.MATERIALS_INPUT:
        return (
          <div>
            <p className="has-text-weight-bold mb-1">{f.name}</p>
            <MaterialsInput
              debounce={1000}
              value={state.filterValues[f.id]}
              onChange={v => actions.setFilterValue(v, f.id)}
              periodicTableMode="onFocus"
              {...f.props}
              // onFieldChange={field => actions.setFilterProps({ field }, f.id, groupId)}
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
        case FilterType.SELECT_SPACEGROUP_SYMBOL:
        case FilterType.SELECT_SPACEGROUP_NUMBER:
        case FilterType.SELECT_CRYSTAL_SYSTEM:
        case FilterType.SELECT:
          return (
            <div>
              <p className="has-text-weight-bold mb-3">{f.name}</p>
              <Select
                {...f.props}
                menuPosition="fixed"
                onChange={item => actions.setFilterValue(item.value, f.id)}
              />
            </div>
          );
        case FilterType.THREE_STATE_BOOLEAN_SELECT:
          return (
            <div>
              <p className="has-text-weight-bold mb-3">{f.name}</p>
              <ThreeStateBooleanSelect
                {...f.props}
                value={state.filterValues[f.id]}
                onChange={item => actions.setFilterValue(item.value, f.id)}
              />
            </div>
          );
        case FilterType.CHECKBOX_LIST:
          return (
            <div>
              <p className="has-text-weight-bold mb-3">{f.name}</p>
              <CheckboxList
                {...f.props}
                onChange={v => actions.setFilterValue(v, f.id)}
              />
            </div>
          );
      default:
        null;
    }
    return null;
  };

  const renderActiveFilterCount = (count) => {
    if (count > 0) {
      return <span className="badge ml-2">{count} active</span>
    } else {
      return null;
    }
  };

  const toggleGroup = (groupName: string) => {
    let newGroupsByName = { ...groupsByName };
    for (const name in newGroupsByName) {
      newGroupsByName[name].expanded = groupName === name ? ! newGroupsByName[name].expanded : false;
    }
    setGroupsByName(newGroupsByName);
    // let newExpandedGroups = [...expandedGroupsByIndex];
    // for (let index = 0; index < newExpandedGroups.length; index++) {
    //   newExpandedGroups[index] = index === i ? !newExpandedGroups[index] : false;
    // }
    // setExpandedGroupsByIndex(newExpandedGroups);
  }

  useEffect(() => {
    let newGroupsByName = { ...groupsByName };
    for (const name in newGroupsByName) {
      const g = newGroupsByName[name];
      g.activeFilterCount = getActiveFilterCount(g, state.activeFilters);
    };
    setGroupsByName(newGroupsByName);
  }, [state.activeFilters]);

  /**
   * This hook initializes panel groups with their max height values
   * This is to allow a smooth transition for showing/hiding the group
   * ! Currently removed because animated show/hide causes strange behavior with focus and auto scroll
   */
  // useEffect(() => {
  //   groupRefs.current.forEach((el, i) => {
  //     // This is a special case for groups with periodic tables in them, should make more dynamic later
  //     if (state.filterGroups[i].name === 'Material') {
  //       const marginTop = 15;
  //       el.style.maxHeight = (el.children[0].clientHeight + 244 + marginTop) + 'px';
  //     } else {
  //       el.style.maxHeight = el.children[0].clientHeight + 'px';
  //     }
  //   });
  // }, []);

  return (
    <div className={props.className}>
      <div className="panel">
        <div className="panel-heading">
          <div className="level">
            <span>Filters</span>
            <button 
              className="button"
              onClick={e => actions.resetFilters()}
            >
              Reset
            </button>
            {/* <Dropdown className="mp-dropdown" value="" label={<FaEllipsisV />} right={true}>
              <Dropdown.Item value="reset">
                <p onClick={e => actions.resetFilters()}>Reset filters</p>
              </Dropdown.Item>
            </Dropdown> */}
          </div>
        </div>
        <div className="panel-block-container">
          {state.filterGroups.map((g, i) => (
            <div 
              className={classNames('panel-block', {'is-active' : groupsByName[g.name].expanded})} 
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
                    onKeyDown={(e) => { if (e.key === 'Enter') toggleGroup(g.name); }}
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
                        'has-opacity-70': !groupsByName[g.name].expanded
                      })}
                    >
                      {g.name}{renderActiveFilterCount(groupsByName[g.name].activeFilterCount)}
                    </span>
                    <div className="is-pulled-right">
                      {!groupsByName[g.name].expanded ? <FaCaretRight /> : <FaCaretDown />}
                    </div>
                  </button>
                </h3>
                <div
                  id={'filter-group-region-' + i}
                  role="region"
                  aria-labelledby={'filter-group-button-' + i}
                  ref={el => (groupRefs.current[i] = el)}
                  className={classNames('panel-block-children', {'is-hidden' : !groupsByName[g.name].expanded})}
                >
                  <div aria-hidden={!groupsByName[g.name].expanded}>
                    {g.filters.map((f, j) => (
                      <div className="mb-2" key={j}>
                        {renderFilter(f, g.name)}
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
