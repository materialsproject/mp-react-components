import React, { useState } from 'react';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import { SearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer';
import { SearchUIGrid } from '../../components/data-display/SearchUI/SearchUIGrid';

/**
 * Component for testing the XAS App view
 */

export const XasApp: React.FC = () => {
  const [state, setState] = useState<any>();
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
        resultLabel="spectrum"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint={process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/xas/' : ''}
        apiKey={process.env.REACT_APP_API_KEY}
        selectableRows={true}
        setProps={setState}
      >
        <SearchUIGrid />
      </SearchUIContainer>
    </>
  );
};
