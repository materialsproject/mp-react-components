import React from 'react';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { SearchUIViewType } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer, SearchUIGrid, SearchUISearchBar } from '../..';

/**
 * Component for testing the CatalystExplorer view
 */

export const CatalystExplorer: React.FC = () => {
  return (
    <>
      <h1 className="title">Catalyst Explorer</h1>
      <SearchUIContainer
        view={SearchUIViewType.TABLE}
        resultLabel="catalyst"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint="https://contribs-api.materialsproject.org/contributions/"
        apiEndpointParams={{
          project: 'open_catalyst_project'
        }}
        apiKey={undefined}
        sortKey="_sort"
        totalKey="total_count"
        limitKey="_limit"
        skipKey="_skip"
        fieldsKey="_fields"
        hasSortMenu={true}
      >
        <SearchUISearchBar
          placeholder="Search by elements, formula, or ID"
          errorMessage="Please enter a valid formula (e.g. CeZn5), list of elements (e.g. Ce, Zn or Ce-Zn), or ID (e.g. mp-394 or mol-54330)."
          periodicTableMode={PeriodicTableMode.NONE}
          allowedInputTypesMap={{
            formula: {
              field: 'formula'
            },
            text: {
              field: 'id'
            }
          }}
        />
        <SearchUIGrid />
      </SearchUIContainer>
    </>
  );
};
