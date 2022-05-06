import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import qs from 'qs';
import { usePrevious } from '../../../../utils/hooks';
import { Column, SearchContextValue, SearchState, SearchUIViewType } from '../types';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useHistory } from 'react-router-dom';
import scrollIntoView from 'scroll-into-view-if-needed';
import {
  initQueryParams,
  isNotEmpty,
  initFilterGroups,
  preprocessQueryParams,
  getActiveFilters
} from '../utils';
import { useRef } from 'react';
import { DecodedValueMap, QueryParamConfigMap, useQueryParams } from 'use-query-params';
import { getRowValueFromSelectorString, initColumns } from '../../../../utils/table';
import { SearchUIContext, SearchUIContextActions } from './SearchUIContextProvider';

/**
 * Alternate version of the SearchUIContextProvider with alpha version support
 * for Matscholar queries.
 */
export const MatscholarSearchUIContextProvider: React.FC<SearchState> = ({
  activeFilters = [],
  totalResults = 0,
  loading = false,
  error = false,
  searchBarValue = '',
  resultsRef = null,
  ...otherProps
}) => {
  let props = {
    activeFilters,
    totalResults,
    loading,
    error,
    searchBarValue,
    resultsRef,
    ...otherProps
  };
  const { children, ...propsWithoutChildren } = props;
  const queryParamConfig = useMemo(() => {
    return initQueryParams(props.filterGroups, props.sortKey, props.limitKey, props.skipKey);
  }, []);
  const [query, setQuery] = useQueryParams(queryParamConfig);
  const history = useHistory();
  const pathname = useMemo(() => {
    return history.location.pathname;
  }, []);
  const filterGroups = useMemo(() => {
    return initFilterGroups(props.filterGroups);
  }, []);
  const columns = useMemo(() => {
    return initColumns(props.columns, props.disableRichColumnHeaders);
  }, []);
  const [state, setState] = useState<SearchState>({
    ...propsWithoutChildren,
    filterGroups,
    columns
  });
  const defaultQuery = {
    [state.sortKey]: state.sortFields,
    [state.limitKey]: 75,
    [state.skipKey]: 0
  };
  /**
   * The fields param is ommitted from the url for brevity and
   * added to the query params internally in the get request
   */
  const fields = state.columns.map((c) => c.selector);
  const prevActiveFilters = usePrevious(state.activeFilters);
  const [textQuery, setTextQuery] = useState();
  const [matScholarMpIds, setMatScholarMpIds] = useState<string[]>();

  const actions = {
    setPage: (page: number) => {
      setQuery({ [props.skipKey]: (page - 1) * query[props.limitKey] });
      const ref = state.resultsRef;
      if (ref && ref.current) {
        scrollIntoView(ref.current, {
          scrollMode: 'if-needed',
          block: 'start',
          behavior: 'smooth'
        });
      }
    },
    setResultsPerPage: (resultsPerPage: number) => {
      setQuery({ [props.limitKey]: resultsPerPage, [props.skipKey]: 0 });
    },
    setSort: (sortField: string, sortAscending: boolean) => {
      const sortFields = [...query[props.sortKey]];
      const directionPrefix = sortAscending ? '' : '-';
      sortFields[0] = directionPrefix + sortField;
      setQuery({ [props.sortKey]: sortFields, [props.skipKey]: 0 });
    },
    setSortField: (sortField: string) => {
      const sortFields = [...query[props.sortKey]];
      sortFields[0] = sortField;
      setQuery({
        [props.sortKey]: sortFields,
        [props.skipKey]: 0
      });
    },
    setSortAscending: function (sortAscending: boolean) {
      this.setSort(query[props.sortKey][0].replace('-', ''), sortAscending);
    },
    setView: (view: SearchUIViewType) => {
      setState((currentState) => ({ ...currentState, view }));
    },
    setColumns: (columns: Column[]) => {
      setState((currentState) => ({ ...currentState, columns }));
    },
    /**
     * Set one filter to a specified value.
     * Optionally include a list of filter id's that should be deactivated
     * if this filter is being set to an active value (e.g. "material_id" should override "formula" and "elements").
     * @param value new filter value
     * @param id property key for the filter (e.g. "formula")
     * @param overrideFields array of property keys to override
     */
    setFilterValue: (value: any, id: string, overrideFields?: string[]) => {
      const filterIsActivating = isNotEmpty(value);
      const newFilterValue = filterIsActivating ? value : undefined;
      const newQuery = {
        [id]: newFilterValue,
        [props.skipKey]: 0
      };
      if (overrideFields && filterIsActivating) {
        overrideFields.forEach((field) => {
          newQuery[field] = undefined;
        });
      }
      setQuery(newQuery);
    },
    setFilterValues: (values: any, params: string[] | string) => {
      const change = { [props.skipKey]: 0 };
      if (Array.isArray(params) && Array.isArray(values)) {
        params.forEach((p, i) => (change[p] = values[i]));
      } else if (typeof params === 'string') {
        change[params] = values;
      }
      setQuery(change);
    },
    removeFilter: (id: string) => {
      if (query.hasOwnProperty(id)) {
        setQuery({
          [id]: undefined,
          [props.skipKey]: 0
        });
      }
    },
    removeFilters: (params: string[] | string) => {
      const remove: any = { [props.skipKey]: 0 };
      if (Array.isArray(params)) {
        params.forEach((p) => (remove[p] = undefined));
      } else {
        remove[params] = undefined;
      }
      setQuery(remove);
    },
    resetFilters: () => {
      setQuery(
        {
          ...defaultQuery,
          [props.sortKey]: query[props.sortKey],
          [props.limitKey]: query[props.limitKey]
        },
        'push'
      );
    },
    setFilterProps: (props: any, filterName: string, groupId: string) => {
      const filterGroups = state.filterGroups;
      const group = filterGroups.find((g) => g.name === groupId);
      const filter = group?.filters.find((f) => f.name === filterName);
      if (filter) filter.props = { ...filter.props, ...props };
      setState({ ...state, filterGroups: filterGroups });
    },
    setSelectedRows: (selectedRows: any[]) => {
      setState((currentState) => ({ ...currentState, selectedRows }));
    },
    getData: () => {
      /** Only show the loading icon if this is a filter change not on simple page change */
      const showLoading = state.activeFilters !== prevActiveFilters ? true : false;
      let isLoading = showLoading;
      // let isLoading = true;
      let minLoadTime = 1000;
      let minLoadTimeReached = !showLoading;
      // let minLoadTimeReached = false;

      const params: any = preprocessQueryParams(
        { ...query, ...props.apiEndpointParams },
        state.filterGroups
      );
      params[props.fieldsKey] = fields;

      const hasFreeTextQuery = params.hasOwnProperty('q');
      const { q, ...paramsWithoutQ } = params;
      const scoresById = {};

      function gatherMatscholarResults(result) {
        let materialIds: string[] = [];
        // console.log(matscholarJson);
        result.data.results.forEach((r) => {
          // matscholarJson.results.forEach((r) => {
          materialIds = materialIds.concat(r.material_id);
        });
        setMatScholarMpIds(materialIds);
        console.log(materialIds);
        return materialIds;
      }

      function completeSearchQuery(result, totalResults?) {
        isLoading = false;
        const loadingValue = minLoadTimeReached ? false : true;
        setState((currentState) => {
          totalResults = totalResults || getRowValueFromSelectorString(props.totalKey, result.data);
          return {
            ...currentState,
            results: result.data.data,
            totalResults: totalResults,
            loading: loadingValue,
            error: false
          };
        });
      }

      function catchSearchError(error) {
        console.log(error);
        isLoading = false;
        const loadingValue = minLoadTimeReached ? false : true;
        setState((currentState) => {
          return {
            ...currentState,
            results: [],
            totalResults: 0,
            loading: loadingValue,
            error: true
          };
        });
      }
      /**
       * if new text query
       * if paginating on current text query
       * if not a text query
       */
      if (hasFreeTextQuery && props.matscholarEndpoint && q !== textQuery) {
        setTextQuery(q);
        axios
          .get(props.matscholarEndpoint, {
            params: { q }
          })
          // .get('/')
          .then(gatherMatscholarResults)
          .then((materialIds) => {
            const materialIdsChunk = materialIds.slice(0, query[state.limitKey]);
            paramsWithoutQ.material_ids = materialIdsChunk;
            axios
              .get(props.apiEndpoint, {
                params: paramsWithoutQ,
                paramsSerializer: (p) => {
                  return qs.stringify(p, { arrayFormat: 'comma' });
                },
                headers: props.apiKey ? { 'X-Api-Key': props.apiKey } : null
              })
              .then((result) => completeSearchQuery(result, materialIds.length))
              .catch(catchSearchError);
          })
          .catch(catchSearchError);
      } else if (hasFreeTextQuery && props.matscholarEndpoint && q === textQuery) {
        const skipValue = params[state.skipKey];
        const limitValue = params[state.limitKey];
        const materialIdsChunk = matScholarMpIds?.slice(skipValue, skipValue + limitValue);
        paramsWithoutQ.material_ids = materialIdsChunk;
        const { _skip, ...paramsWithoutSkip } = paramsWithoutQ;
        axios
          .get(props.apiEndpoint, {
            params: paramsWithoutSkip,
            paramsSerializer: (p) => {
              return qs.stringify(p, { arrayFormat: 'comma' });
            },
            headers: props.apiKey ? { 'X-Api-Key': props.apiKey } : null
          })
          .then((result) => completeSearchQuery(result, matScholarMpIds?.length))
          .catch(catchSearchError);
      } else {
        axios
          .get(props.apiEndpoint, {
            params: params,
            paramsSerializer: (p) => {
              return qs.stringify(p, { arrayFormat: 'comma' });
            },
            headers: props.apiKey ? { 'X-Api-Key': props.apiKey } : null
          })
          .then(completeSearchQuery)
          .catch(catchSearchError);
      }

      // axios
      //   .get(props.apiEndpoint, {
      //     params: params,
      //     paramsSerializer: (p) => {
      //       return qs.stringify(p, { arrayFormat: 'comma' });
      //     },
      //     headers: props.apiKey ? { 'X-Api-Key': props.apiKey } : null
      //   })
      //   .then((result) => {
      //     isLoading = false;
      //     const loadingValue = minLoadTimeReached ? false : true;
      //     setState((currentState) => {
      //       const totalResults = getRowValueFromSelectorString(props.totalKey, result.data);
      //       return {
      //         ...currentState,
      //         results: result.data.data,
      //         totalResults: totalResults,
      //         loading: loadingValue,
      //         error: false
      //       };
      //     });
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     isLoading = false;
      //     const loadingValue = minLoadTimeReached ? false : true;
      //     setState((currentState) => {
      //       return {
      //         ...currentState,
      //         results: [],
      //         totalResults: 0,
      //         loading: loadingValue,
      //         error: true
      //       };
      //     });
      //   });

      if (showLoading) {
        setTimeout(() => {
          if (!isLoading) {
            setState((currentState) => {
              return { ...currentState, loading: false };
            });
          } else {
            minLoadTimeReached = true;
          }
        }, minLoadTime);
      }

      setState((currentState) => {
        return { ...currentState, loading: isLoading };
      });
    },
    setResultsRef: (resultsRef: React.RefObject<HTMLDivElement> | null) => {
      setState((currentState) => ({ ...currentState, resultsRef }));
    }
  };

  /**
   * When a filter or query param changes, compute the list of active filters.
   * Also, update the search bar value if one of its corresponding filters changes.
   *
   * If the default query params are missing (e.g. limit, skip, sort) then add them to the query.
   */
  useDeepCompareEffect(() => {
    if (history.location.pathname === pathname) {
      if (query[props.limitKey]) {
        const activeFilters = getActiveFilters(state.filterGroups, query);
        let searchBarValue = state.searchBarValue;
        const searchBarFieldFilter = activeFilters.find((f) => f.isSearchBarField === true);
        if (searchBarFieldFilter) {
          searchBarValue = searchBarFieldFilter.value;
        }
        setState({ ...state, activeFilters, searchBarValue });
      } else if (!query[props.skipKey] || !query[props.limitKey] || !query[props.sortKey]) {
        setQuery({ ...query, ...defaultQuery });
      }
    }
  }, [query]);

  /**
   * When the active filters change, fetch a new set of results.
   * This should also be run when the initial query fields are populated (on load).
   */
  useDeepCompareEffect(() => {
    if (query[props.limitKey]) {
      actions.getData();
    }
  }, [state.activeFilters, query[props.skipKey], query[props.limitKey], query[props.sortKey]]);

  /**
   * Use setProps to update props that should be
   * accessible by dash callbacks.
   */
  useEffect(() => {
    props.setProps({
      results: state.results,
      selectedRows: state.selectedRows
    });
  }, [state.results, state.selectedRows]);

  return (
    <SearchUIContext.Provider value={{ state, query }}>
      <SearchUIContextActions.Provider value={actions}>
        <div>{children}</div>
      </SearchUIContextActions.Provider>
    </SearchUIContext.Provider>
  );
};
