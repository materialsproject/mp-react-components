import classNames from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react';
import { BibjsonCard } from '../BibjsonCard/BibjsonCard';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import { FaAngleDown, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import './BibjsonFilter.css';

/**
 * Component for rendering and filtering a list of citations in bibjson format
 * Expects bibjson in the format output by the bibtexparser library (https://bibtexparser.readthedocs.io/en/v1.1.0/tutorial.html#)
 */

interface Props {
  className?: string;
  bibjson: any[];
  sortField: string;
  ascending?: boolean;
}

const dynamicSort = (field, asc?) => {
  const sortDirection = asc ? 1 : -1;
  return (a, b) => {
    const result = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
    return result * sortDirection;
  };
};

export const BibjsonFilter: React.FC<Props> = ({
  sortField = 'year',
  ascending = false,
  ...otherProps
}) => {
  const props = { sortField, ascending, ...otherProps };
  const [searchValue, setSearchValue] = useState('');
  const [sortFieldState, setSortFieldState] = useState(props.sortField);
  const [sortAsc, setSortAsc] = useState(props.ascending);
  const [bibEntries, setBibEntries] = useState(props.bibjson.sort(dynamicSort(sortField, sortAsc)));

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSortFieldChange = (field: string) => {
    setSortFieldState(field);
  };

  const handleSort = () => {
    const sortedEntries = bibEntries.sort(dynamicSort(sortFieldState, sortAsc));
    setBibEntries([...sortedEntries]);
  };

  const handleSortDirection = () => {
    setSortAsc(!sortAsc);
  };

  useEffect(() => {
    handleSort();
  }, [sortAsc, sortFieldState]);

  useEffect(() => {
    const sortedEntries = props.bibjson.sort(dynamicSort(sortFieldState, sortAsc));
    setBibEntries(
      sortedEntries.filter((d) => {
        const entryStr = JSON.stringify(d).toUpperCase();
        const searchTokens = searchValue.toUpperCase().split(' ');
        let match = true;
        searchTokens.forEach((token) => {
          if (entryStr.indexOf(token) === -1) {
            match = false;
          }
        });
        return match;
      })
    );
  }, [searchValue]);

  return (
    <div data-testid="bibjson-filter" className={classNames('mpc-bibjson-filter', props.className)}>
      <div className="mpc-bibjson-filter-controls">
        <input
          className="mpc-bibjson-filter-input input"
          type="search"
          onChange={handleSearchChange}
        />
        <MenuWrapper
          data-testid="bibjson-filter-sort-menu"
          className="mpc-bibjson-filter-sort-menu dropdown is-active"
          onSelection={handleSortFieldChange}
        >
          <div className="dropdown-trigger">
            <Button className="button">
              <span>Sort by: {sortFieldState}</span>
              <span className="icon">
                <FaAngleDown />
              </span>
            </Button>
          </div>
          <Menu className="dropdown-menu">
            <ul className="dropdown-content">
              <MenuItem value="year">
                <li className="dropdown-item">Year</li>
              </MenuItem>
              <MenuItem value="author">
                <li className="dropdown-item">Author</li>
              </MenuItem>
              <MenuItem value="title">
                <li className="dropdown-item">Title</li>
              </MenuItem>
            </ul>
          </Menu>
        </MenuWrapper>
        <button
          className="mpc-bibjson-filter-sort-button button"
          onClick={handleSortDirection}
          aria-label={sortAsc ? 'Sorted in ascending order' : 'Sorted in descending order'}
        >
          <FaSort className="mpc-bibjson-filter-sort-icon-bg" />
          {sortAsc ? <FaSortUp /> : <FaSortDown />}
        </button>
      </div>
      <div>
        {bibEntries.map((entry, i) => (
          <BibjsonCard key={i} className="box" bibjsonEntry={entry} />
        ))}
      </div>
    </div>
  );
};
