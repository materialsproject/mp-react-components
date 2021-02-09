import React, { useEffect, useState } from 'react';
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
import axios from 'axios';

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

  const [distributions, setDistributions] = useState<any[]>([]);

  useEffect(() => {
    let requests: any = [];
    materialsColumns.forEach((col, i) => {
      if (i === 0) {
        const request = axios.get('https://api.materialsproject.org/search/generate_statistics/', {
          params: {
            field: 'density',
            min_val: 1,
            max_val: 10,
            num_points: 100,
          },
        });
        requests.push(request);
      } else if (i === 1) {
        const request = axios.get('https://api.materialsproject.org/search/generate_statistics/', {
          params: {
            field: 'volume',
            min_val: 1,
            max_val: 10000,
            num_points: 100,
          },
        });
        requests.push(request);
      }
    });
    console.log(requests);
    axios
      .all(requests)
      .then(
        axios.spread((...responses) => {
          console.log(responses);
          setDistributions(responses.map((d: any) => d.data));
        })
      )
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="p-4">
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
        distributions={distributions}
      />
    </div>
  );
};
