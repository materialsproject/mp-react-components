import React, { useState, useEffect } from 'react';
import { SearchUIContextProvider } from './context/SearchUIContextProvider';
import { SearchUIFilters } from './SearchUIFilters';
import { SearchUIDataTable } from './SearchUIDataTable';
import { FilterValues } from './constants';

interface Props {
  columns: any[];
  filterGroups: any[];
}

export const SearchUI: React.FC<Props> = ({ columns, filterGroups }) => {
  return (
    <div className="columns" style={{ padding: '15px' }}>
      <SearchUIContextProvider columns={columns} filterGroups={filterGroups}>
        <SearchUIFilters className="column is-narrow" />
        <SearchUIDataTable className="column" />
      </SearchUIContextProvider>
    </div>
  );
};
