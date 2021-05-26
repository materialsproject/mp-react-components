import classNames from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react';
import { BibjsonCard } from '../BibjsonCard/BibjsonCard';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import { FaAngleDown, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import './BibFilter.css';
import { CrossrefCard } from '../CrossrefCard';
import { SortDropdown } from '../SortDropdown';
import { sortCrossref, sortDynamic } from '../utils';

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
        <SortDropdown
          sortValues={bibEntries}
          setSortValues={setBibEntries}
          sortOptions={[
            { label: 'Year', value: 'year' },
            { label: 'Author', value: 'author' },
            { label: 'Title', value: 'title' },
          ]}
          sortField={sortFieldState}
          setSortField={setSortFieldState}
          sortAscending={sortAsc}
          setSortAscending={setSortAsc}
          sortFn={sortMap[format]}
        />
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
