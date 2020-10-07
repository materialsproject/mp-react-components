import React, { useState, useEffect } from 'react';
import { MaterialsSearchProvider } from './MaterialsSearchProvider';
import { SearchFilters } from './SearchFilters';
import { MaterialsDataTable } from './MaterialsDataTable';
import { FilterValues } from './MaterialsSearchConstants';

interface Props {
  columns: any[];
  groups: any[];
  values: FilterValues;
}

export const MaterialsSearch: React.FC<Props> = ({ columns, groups, values }) => {
  return (
    <div className="columns" style={{ padding: '15px' }}>
      <MaterialsSearchProvider columns={columns} groups={groups} values={values}>
        <SearchFilters className="column is-narrow" />
        <MaterialsDataTable className="column" />
      </MaterialsSearchProvider>
    </div>
  );
};
