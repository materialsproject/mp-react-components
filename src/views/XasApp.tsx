import React, { useState } from 'react';
import { SearchUI } from '../components/search/SearchUI';
import { xasColumns, xasGroups } from '../constants/xas';

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
        {state?.selectedRows.map((r) => (
          <span>{r.task_id}, </span>
        ))}
      </div>
      <SearchUI
        resultLabel="spectrum"
        columns={xasColumns}
        filterGroups={xasGroups}
        baseURL={process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/xas/' : ''}
        apiKey={process.env.REACT_APP_API_KEY}
        hasSearchBar={false}
        selectableRows={true}
        setProps={setState}
      />
    </>
  );
};
