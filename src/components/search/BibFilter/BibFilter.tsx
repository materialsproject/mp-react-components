import classNames from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react';
import { BibjsonCard } from '../BibjsonCard/BibjsonCard';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import { FaAngleDown, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import './BibFilter.css';
import { CrossrefCard } from '../CrossrefCard';

/**
 * Component for rendering and filtering a list of citations in bibjson or crossref format
 * Expects bibjson in the format output by the bibtexparser library (https://bibtexparser.readthedocs.io/en/v1.1.0/tutorial.html#)
 * Expects crossref in the format returned by the Crossref API
 */

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  bibEntries: any[];
  format?: 'crossref' | 'bibjson';
  sortField?: string;
  ascending?: boolean;
  resultClassName?: string;
  fetchOpenAccessUrl?: boolean;
}

const sortDynamic = (field, asc?) => {
  const sortDirection = asc ? 1 : -1;
  return (a, b) => {
    const result = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
    return result * sortDirection;
  };
};

const sortCrossref = (field, asc?) => {
  const sortDirection = asc ? 1 : -1;
  return (a, b) => {
    let result = 0;
    switch (field) {
      case 'year':
        result =
          a.created.timestamp < b.created.timestamp
            ? -1
            : a.created.timestamp > b.created.timestamp
            ? 1
            : 0;
        break;
      case 'author':
        result =
          a.author[0].family < b.author[0].family
            ? -1
            : a.author[0].family > b.author[0].family
            ? 1
            : 0;
        break;
      case 'title':
        result = a.title[0] < b.title[0] ? -1 : a.title[0] > b.title[0] ? 1 : 0;
        break;
      default:
        result = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
    }
    return result * sortDirection;
  };
};

const sortMap = {
  crossref: sortCrossref,
  bibjson: sortDynamic,
};

export const BibFilter: React.FC<Props> = ({
  format = 'bibjson',
  sortField = 'year',
  ascending = false,
  ...otherProps
}) => {
  const props = { format, sortField, ascending, ...otherProps };
  const [searchValue, setSearchValue] = useState('');
  const [sortFieldState, setSortFieldState] = useState(props.sortField);
  const [sortAsc, setSortAsc] = useState(props.ascending);
  const sortEntries = sortMap[format];
  const [bibEntries, setBibEntries] = useState(
    props.bibEntries.sort(sortEntries(props.sortField, sortAsc))
  );

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSortFieldChange = (field: string) => {
    setSortFieldState(field);
  };

  const handleSort = () => {
    const sortedEntries = bibEntries.sort(sortEntries(sortFieldState, sortAsc));
    setBibEntries([...sortedEntries]);
  };

  const handleSortDirection = () => {
    setSortAsc(!sortAsc);
  };

  useEffect(() => {
    handleSort();
  }, [sortAsc, sortFieldState]);

  useEffect(() => {
    const sortedEntries = props.bibEntries.sort(sortEntries(sortFieldState, sortAsc));
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
    <div
      id={props.id}
      data-testid="bibjson-filter"
      className={classNames('mpc-bib-filter', props.className)}
    >
      <div className="mpc-bib-filter-controls">
        <input className="mpc-bib-filter-input input" type="search" onChange={handleSearchChange} />
        <MenuWrapper
          data-testid="bibjson-filter-sort-menu"
          className="mpc-bib-filter-sort-menu dropdown is-active"
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
          className="mpc-bib-filter-sort-button button"
          onClick={handleSortDirection}
          aria-label={sortAsc ? 'Sorted in ascending order' : 'Sorted in descending order'}
        >
          <FaSort className="mpc-bib-filter-sort-icon-bg" />
          {sortAsc ? <FaSortUp /> : <FaSortDown />}
        </button>
      </div>
      <div className="mpc-bib-filter-results">
        {bibEntries.map((entry, i) => {
          return props.format === 'bibjson' ? (
            <BibjsonCard
              key={i}
              className={props.resultClassName}
              bibjsonEntry={entry}
              fetchOpenAccessUrl={props.fetchOpenAccessUrl}
            />
          ) : (
            <CrossrefCard
              key={i}
              className={props.resultClassName}
              crossrefEntry={entry}
              fetchOpenAccessUrl={props.fetchOpenAccessUrl}
            />
          );
        })}
      </div>
    </div>
  );
};
