import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import { FaAngleDown, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { sortDynamic } from '../../data-entry/utils';

/**
 * Component for rendering and filtering a list of citations in bibjson or crossref format
 * Expects bibjson in the format output by the bibtexparser library (https://bibtexparser.readthedocs.io/en/v1.1.0/tutorial.html#)
 * Expects crossref in the format returned by the Crossref API
 */

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  sortValues: any[];
  setSortValues?: (value: any) => any;
  sortOptions: DropdownItem[];
  sortField?: string;
  setSortField: (value: any) => any;
  sortAscending?: boolean;
  setSortAscending: (value: any) => any;
  sortFn?: (field: string, asc: boolean) => any;
}

export interface DropdownItem {
  label: string;
  value: string;
}

export const SortDropdown: React.FC<Props> = ({
  sortAscending = false,
  sortFn = sortDynamic,
  sortOptions,
  sortField = sortOptions[0].value,
  ...otherProps
}) => {
  const props = { sortAscending, sortFn, sortOptions, sortField, ...otherProps };

  const getLabelByValue = (value: string) => {
    const option = props.sortOptions.find((d) => d.value === value);
    return option?.label;
  };

  const handleSortFieldChange = (field: string) => {
    props.setSortField(field);
  };

  const handleSort = () => {
    if (props.setSortValues) {
      const sortedValues = props.sortValues.sort(
        props.sortFn(props.sortField, props.sortAscending)
      );
      props.setSortValues([...sortedValues]);
    } else {
      props.sortFn(props.sortField, props.sortAscending);
    }
  };

  const handleSortDirection = () => {
    props.setSortAscending(!props.sortAscending);
  };

  useEffect(() => {
    handleSort();
  }, [props.sortAscending, props.sortField]);

  return (
    <div
      id={props.id}
      data-testid="mpc-sort-dropdown"
      className={classNames('mpc-sort-dropdown field has-addons', props.className)}
    >
      <div className="control">
        <button
          className="mpc-sort-button button"
          onClick={handleSortDirection}
          aria-label={
            props.sortAscending ? 'Sorted in ascending order' : 'Sorted in descending order'
          }
        >
          <FaSort className="mpc-bib-filter-sort-icon-bg" />
          {props.sortAscending ? <FaSortUp /> : <FaSortDown />}
        </button>
      </div>
      <div className="control">
        <MenuWrapper className="dropdown is-active is-right" onSelection={handleSortFieldChange}>
          <div className="dropdown-trigger">
            <Button className="button">
              <span>Sort: {getLabelByValue(props.sortField)}</span>
              <span className="icon">
                <FaAngleDown />
              </span>
            </Button>
          </div>
          <Menu className="dropdown-menu">
            <ul className="dropdown-content">
              {props.sortOptions.map((item, i) => (
                <MenuItem key={`sort-dropdown-item-${i}`} value={item.value}>
                  <li className="dropdown-item">{item.label}</li>
                </MenuItem>
              ))}
            </ul>
          </Menu>
        </MenuWrapper>
      </div>
    </div>
  );
};
