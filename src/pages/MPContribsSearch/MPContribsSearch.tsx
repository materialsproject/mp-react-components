import React from 'react';
import { SearchUI } from '../../components/data-display/SearchUI';
import { FilterGroup } from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { SearchUIViewType } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';

/**
 * Component for testing the MPContribsSearch view
 */

export const MPContribsSearch: React.FC = () => {
  return (
    <>
      <h1 className="title">MPContribs Search</h1>
      <SearchUI
        view={SearchUIViewType.TABLE}
        isContribs
        resultLabel="contribution"
        columns={columns}
        filterGroups={filterGroups as FilterGroup[]}
        baseURL="https://contribs-api.materialsproject.org/contributions/"
        apiKey={undefined}
        hasSortMenu={true}
        sortAscending={true}
        searchBarTooltip="Type in a comma-separated list of element symbols (e.g. Ga, N), a chemical formula (e.g. C3N), or a material id (e.g. mp-10152). You can also click elements on the periodic table to add them to your search."
        searchBarPlaceholder="Search by elements, formula, or ID"
        searchBarErrorMessage="Please enter a valid formula (e.g. CeZn5), list of elements (e.g. Ce, Zn or Ce-Zn), or ID (e.g. mp-394 or mol-54330)."
        searchBarPeriodicTableMode={PeriodicTableMode.NONE}
        searchBarAllowedInputTypesMap={{
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
    </>
  );
};
