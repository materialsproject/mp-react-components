import React, { useEffect, useState } from 'react';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import { SearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer';
import { SearchUIGrid } from '../../components/data-display/SearchUI/SearchUIGrid';
import { SearchUIFilters } from '../../components/data-display/SearchUI/SearchUIFilters';
import { SearchUIDataHeader } from '../../components/data-display/SearchUI/SearchUIDataHeader';
import { SearchUIDataView } from '../../components/data-display/SearchUI/SearchUIDataView';

/**
 * Component for testing the XAS App view
 */

export const XasApp: React.FC = () => {
  const [state, setState] = useState<any>({ selectedRows: [] });

  useEffect(() => {
    console.log(state);
  }, [state.selectedRows]);
  return (
    <>
      <h1 className="title">X-Ray Absorption Spectra</h1>
      <div>
        <span>Selected Rows: </span>
        {state?.selectedRows.map((r, i) => (
          <span key={i}>{r.material_id}, </span>
        ))}
      </div>
      <button className="button" onClick={() => setState({ ...state, selectedRows: [] })}>
        Clear Selected Rows
      </button>
      <SearchUIContainer
        className="mpc-search-ui"
        resultLabel="spectrum"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint={process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/xas/' : ''}
        apiKey={process.env.REACT_APP_API_KEY}
        selectableRows={true}
        selectedRows={state.selectedRows}
        setProps={setState}
      >
        <div className="mpc-search-ui-content columns">
          <div className="mpc-search-ui-left column is-narrow is-12-mobile">
            <SearchUIFilters />
          </div>
          <div className="mpc-search-ui-right column">
            <SearchUIDataHeader />
            <div className="box" style={{ height: '300px' }}></div>
            <SearchUIDataView />
          </div>
        </div>
      </SearchUIContainer>
    </>
  );
};
