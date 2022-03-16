import React from 'react';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { SearchUIViewType } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';

/**
 * Component for testing the CatalystExplorer view
 */

export const CatalystExplorer: React.FC = () => {
  return (
    <>
      <h1 className="title">Catalyst Explorer</h1>
      {/* <SearchUI
        view={SearchUIViewType.TABLE}
        isContribs
        resultLabel="catalyst"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint="https://contribs-api.materialsproject.org/contributions/"
        apiEndpointParams={{
          project: 'open_catalyst_project'
        }}
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
          text: {
            field: 'id'
          }
        }}
      /> */}
    </>
  );
};
