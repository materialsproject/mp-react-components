import React from 'react';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { SearchUIViewType } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer, SearchUIGrid, SearchUISearchBar } from '../..';

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
      <SearchUIContainer
        view={SearchUIViewType.TABLE}
        resultLabel="MOF"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint="https://contribs-api.materialsproject.org/contributions/"
        apiEndpointParams={{ project: 'qmof' }}
        apiKey={undefined}
        hasSortMenu={true}
        sortKey="_sort"
        totalKey="total_count"
        limitKey="_limit"
        skipKey="_skip"
        fieldsKey="_fields"
        sortFields={['data.natoms.value']}
      >
        <SearchUISearchBar
          placeholder="e.g. Zn4C24H12O13 or qmof-a2d95c3"
          errorMessage='Please enter a valid formula (e.g. "Zn4C24H12O13").'
          periodicTableMode={PeriodicTableMode.NONE}
          allowedInputTypesMap={{
            formula: { field: 'data__reducedFormula' },
            text: { field: 'identifier' }
          }}
          helpItems={[
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
        <SearchUIGrid />
      </SearchUIContainer>
    </>
  );
};
