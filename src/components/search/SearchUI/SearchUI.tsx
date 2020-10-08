import React, { useState, useEffect } from 'react';
import { SearchUIContextProvider } from './context/SearchUIContextProvider';
import { SearchUIFilters } from './SearchUIFilters';
import { SearchUIDataTable } from './SearchUIDataTable';
import { FilterValues } from './constants';

interface Props {
  columns: any[];
  filterGroups: any[];
  baseURL: string;
  apiKey?: string;
}

export const SearchUI: React.FC<Props> = ({ columns, filterGroups, baseURL, apiKey }) => {
  return (
    <div className="columns" style={{ padding: '15px' }}>
      <SearchUIContextProvider
        columns={columns}
        filterGroups={filterGroups}
        baseURL={baseURL}
        apiKey={apiKey}
      >
        <SearchUIFilters className="column is-narrow" />
        <SearchUIDataTable className="column" />
      </SearchUIContextProvider>
    </div>
  );
};
