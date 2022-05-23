import React from 'react';
import { SearchUI } from '../../components/data-display/SearchUI';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { SearchUIViewType } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';

/**
 * Component for testing the Materials Explorer view
 */

export const MofExplorer: React.FC = () => {
  return (
    <>
      <h1
        className="title is-1"
        style={{
          height: '12rem',
          lineHeight: '12rem',
          borderBottom: '1px solid #ddd',
          textAlign: 'center'
        }}
      >
        MOF Explorer
      </h1>
      <SearchUI
        view={SearchUIViewType.TABLE}
        resultLabel="MOF"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        isContribs={true}
        apiEndpoint="https://contribs-api.materialsproject.org/contributions/"
        apiEndpointParams={{ project: 'qmof' }}
        apiKey={undefined}
        hasSortMenu={true}
        sortField="data.natoms.value"
        sortAscending={false}
        // secondarySortField="formula_pretty"
        // secondarySortAscending={true}
        searchBarPlaceholder="e.g. Zn4C24H12O13 or qmof-a2d95c3"
        searchBarErrorMessage='Please enter a valid formula (e.g. "Zn4C24H12O13").'
        searchBarPeriodicTableMode={PeriodicTableMode.NONE}
        searchBarAllowedInputTypesMap={{
          formula: { field: 'data__reducedFormula' },
          text: { field: 'identifier' }
        }}
        searchBarHelpItems={[
          { label: 'Search Examples' },
          {
            label: 'Has exact formula (alphabetical)',
            examples: ['Zn4C24H12O13', 'CuC6H2O4']
          },
          {
            label: 'Has QMOF ID',
            examples: ['qmof-a2d95c3', 'qmof-8b5bb88']
          },
          {
            label: 'Additional search options are available in the filters panel.'
          }
        ]}
      />
    </>
  );
};
