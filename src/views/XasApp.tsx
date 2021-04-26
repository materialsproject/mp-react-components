import React from 'react';
import { SearchUI } from '../components/search/SearchUI';
import { xasColumns, xasGroups } from '../constants/xas';

/**
 * Component for testing the XAS App view
 */

export const XasApp: React.FC = () => {
  return (
    <>
      <h1 className="title">X-Ray Absorption Spectra</h1>
      <SearchUI
        resultLabel="spectra"
        columns={xasColumns}
        filterGroups={xasGroups}
        baseURL={process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/xas/' : ''}
        apiKey={process.env.REACT_APP_API_KEY}
        hasSearchBar={false}
        selectableRows={true}
        plotSelectedRows={true}
        plot={{
          title: 'Spectra',
          xKey: 'spectrum.x',
          yKey: 'spectrum.y',
        }}
      />
    </>
  );
};
