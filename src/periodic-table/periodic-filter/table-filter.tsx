import { FILTER_BY_CATEGORY, FILTER_VALUE_MAPPER, FILTERS } from "./filter-definitions";
import * as React from "react";
import './table-filter.less';
import { TABLE_V2 } from "../periodic-table-data/table-v2";
import { TABLE_DICO_CLASS } from "../periodic-table-data/table";
import { PeriodicSelectionContext } from "../periodic-table-state/table-store";

//TODO(chab) cache computations
function performFilter(array: any[], key: string, value: string): any[] {
  return array.reduce((acc, element) => {
    const _isFiltered = isFiltered(element);
    if (!_isFiltered) {
      acc[element.symbol] = true; // we allow type coercion, we put hidden elements in the dico
    }
    return acc;
  }, {});

  function isFiltered(element: any) {
    if (key === 'category') {
      //console.log(value, TABLE_DICO_CLASS[a.symbol]);
      return TABLE_DICO_CLASS[element.symbol] == value;
    } else {
      return element[key] == value
    }
  }
}


export function TableFilter() {
  // TODO support multi filtering
  const [filter, setFilter] = React.useState({topFilter: {name: 'All'} as any, lowerFilter: {name: 'All'} as any});
  const { actions } = React.useContext(PeriodicSelectionContext);

  function dispatchFilter(f: any) {
    setFilter({...filter, lowerFilter:f});
    let filterValue = FILTER_VALUE_MAPPER[f.name];
    if (!filterValue) {
      //TODO(chab) use a boolean flag instead
      console.warn('no mapping value found, falling back to default value');
      filterValue = f.name;
    }
    const filteredElements = performFilter(TABLE_V2, filter.topFilter.key, filterValue);
    actions.setHiddenElements(filteredElements);
  }

  return (
    <div className="mat-table-filter">
      <div className="left-side">
        Filters
      </div>
      <div className="right-side">
        <div className="filter-selector">
          {FILTERS.categories.map((filterGroup, idx) =>
            <div key={idx} className="filter-group">
              {(filterGroup as any[]).map(f =>
                <div key={f.name}
                     onClick={() => {
                       setFilter({lowerFilter: f.name === 'All' ? 'All' : filter.lowerFilter, topFilter:f});
                       f.name === 'All' && actions.setHiddenElements({});
                     }}
                     className={`current-filter-selector ${f.name === filter.topFilter.name ? 'selected' : ''}`}>
                  {f.name}
                </div>)}
            </div>
          )}
        </div>
        <div className="sub-filter-selector">
          {(FILTER_BY_CATEGORY[filter.topFilter.name] as any[]).map(f =>
            <div key={f.name}
                 onClick={() => dispatchFilter(f)}
                 className={`current-filter-selector ${f.name === filter.lowerFilter.name || filter.lowerFilter.name === 'All' ? 'selected' : ''}`}>
              {f.name}
            </div>)}
        </div>
      </div>
    </div>
  )
}
