import React from 'react';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { SearchUIViewType } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer, SearchUIGrid, SearchUISearchBar } from '../..';

/**
 * Component for testing the MPContribsSearch view
 */

export const MPContribsSearch: React.FC = () => {
  return (
    <>
      <h1 className="title">MPContribs Search</h1>
      <SearchUIContainer
        view={SearchUIViewType.TABLE}
        isContribs
        resultLabel="contribution"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint="https://contribs-api.materialsproject.org/contributions/"
        apiKey={undefined}
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
            mpid: {
              field: 'identifier'
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
