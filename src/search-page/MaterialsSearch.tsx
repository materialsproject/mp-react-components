import React, { useState, useEffect } from 'react';
import { MaterialsSearchProvider } from './MaterialsSearchProvider';
import { SearchFilters } from './SearchFilters';
import { MaterialsDataTable } from './MaterialsDataTable';

export const MaterialsSearch = () => {
  return (
    <MaterialsSearchProvider>
      <SearchFilters />
      <MaterialsDataTable />
    </MaterialsSearchProvider>
  );
}