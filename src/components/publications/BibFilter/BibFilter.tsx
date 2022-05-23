import classNames from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react';
import { BibjsonCard } from '../BibjsonCard';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import { FaAngleDown, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import './BibFilter.css';
import { CrossrefCard } from '../CrossrefCard';
import { SortDropdown } from '../../data-display/SortDropdown';
import { sortCrossref, sortDynamic } from '../../data-entry/utils';

export interface BibFilterProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;

  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;

  /**
   * Class name(s) to append to the component's default class (mpc-bib-filter)
   */
  className?: string;

  /**
   * List of objects in bibjson or crossref format.
   * Only the following bib properties are used by this component:
   * title, author (as a list or string), year, doi, and journal.
   * If any of those properties are missing, that property will be omitted from the result card.
   * Any extra properties are simply ignored.
   */
  bibEntries: any[];

  /**
   * Format of the bibliographoc objects supplied in `bibEntries`
   * @default 'bibjson'
   */
  format?: 'crossref' | 'bibjson';

  /**
   * Name of property to initially sort entries by
   * @default 'year'
   */
  sortField?: string;

  /**
   * Set to true to have the initial sorting direction be ascending
   * @default false
   */
  ascending?: boolean;

  /**
   * Class name(s) to append to individual result cards' default class (mpc-bib-card)
   */
  resultClassName?: string;

  /**
   * Set to true to prevent dynamically fetching a link to a free PDF of
   * each reference (using the "doi" field for individual bib entry).
   * NOTE: the open access URL can also be included in a bib entry
   * in the "openAccessUrl" property. If set, the URL will not be fetched.
   * @default false
   */
  preventOpenAccessFetch?: boolean;
}

const sortMap = {
  crossref: sortCrossref,
  bibjson: sortDynamic
};

/**
 * Component for rendering and filtering a list of citations in bibjson or crossref format.
 * Expects bibjson in the format output by the bibtexparser library (https://bibtexparser.readthedocs.io/en/v1.1.0/tutorial.html#).
 * Expects crossref in the format returned by the Crossref API.
 */
export const BibFilter: React.FC<BibFilterProps> = ({
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
        <input
          className="mpc-bib-filter-input input"
          role="searchbox"
          type="search"
          aria-label="publication search"
          onChange={handleSearchChange}
        />
        <SortDropdown
          sortValues={bibEntries}
          setSortValues={setBibEntries}
          sortOptions={[
            { label: 'Year', value: 'year' },
            { label: 'Author', value: 'author' },
            { label: 'Title', value: 'title' }
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
              preventOpenAccessFetch={props.preventOpenAccessFetch}
            />
          ) : (
            <CrossrefCard
              key={i}
              className={props.resultClassName}
              crossrefEntry={entry}
              preventOpenAccessFetch={props.preventOpenAccessFetch}
            />
          );
        })}
      </div>
    </div>
  );
};
