import React from 'react';
import { SearchUI } from '../components/search/SearchUI';
import { materialsColumns, materialsGroups } from '../constants/materials';
import {
  Histogram,
  DensitySeries,
  BarSeries,
  withParentSize,
  XAxis,
  YAxis,
} from '@data-ui/histogram';

/**
 * Component for testing the Materials Explorer view
 */

export const MaterialsExplorer: React.FC = () => {
  const ResponsiveHistogram = withParentSize(({ parentWidth, parentHeight, ...rest }) => (
    <Histogram width={parentWidth} height={parentHeight} {...rest} />
  ));

  const rawData = Array(100)
    .fill(0)
    .map(
      () =>
        (Math.random() +
          Math.random() +
          Math.random() +
          Math.random() +
          Math.random() +
          Math.random() -
          3) /
        3
    );

  return (
    <div className="p-4">
      {/* <div style={{height: '500px'}}>
        <ResponsiveHistogram
          ariaLabel="My histogram of ..."
          orientation="vertical"
          cumulative={false}
          normalized={true}
          binCount={50}
          valueAccessor={datum => datum}
          binType="numeric"
        >
          <BarSeries
            animated
            rawData={rawData}
          />
          <DensitySeries
            animated
            smoothing={0.005}
            kernel="parabolic"
            rawData={rawData}
          />
        </ResponsiveHistogram>
      </div> */}
      <h1 className="title">Materials Explorer</h1>
      <SearchUI
        resultLabel="material"
        columns={materialsColumns}
        filterGroups={materialsGroups}
        baseURL={process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/search/' : ''}
        autocompleteFormulaUrl={
          process.env.REACT_APP_AUTOCOMPLETE_URL
            ? process.env.REACT_APP_AUTOCOMPLETE_URL
            : undefined
        }
        apiKey={undefined}
        searchBarTooltip="Type in a comma-separated list of element symbols (e.g. Ga, N), a chemical formula (e.g. C3N), or a material id (e.g. mp-10152). You can also click elements on the periodic table to add them to your search."
        searchBarPlaceholder="Search by elements, formula, or mp-id"
        sortField="e_above_hull"
        sortAscending={true}
      />
    </div>
  );
};
