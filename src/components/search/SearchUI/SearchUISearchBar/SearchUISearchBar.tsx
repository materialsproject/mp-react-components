import React, { useState, useEffect } from 'react';
import { MaterialsInput } from '../../MaterialsInput';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { MaterialsInputType } from '../../MaterialsInput';
import { Filter } from '../types';

/**
 * A specific version of the MaterialsInput component used within the SearchUI component
 * for performing top level searches by mp-id, formula, or elements.
 * The input value is parsed into its appropriate search field upon submission.
 */

export const SearchUISearchBar: React.FC = () => {
  const actions = useSearchUIContextActions();
  const state = useSearchUIContext();
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchParsedValue, setSearchParsedValue] = useState<string | string[]>('');
  const [searchInputType, setSearchInputType] = useState<MaterialsInputType>(
    state.topLevelSearchField
  );
  const allowSmiles = state.resultLabel === 'molecule';

  const shouldHidePeriodicTable = () => {
    if (state.activeFilters && state.activeFilters.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const getFieldsToOverride = (selectedField: string) => {
    let fields: string[] = [];
    state.filterGroups.forEach((g) => {
      g.filters.forEach((f) => {
        if (f.id !== selectedField && (f.type === 'MATERIALS_INPUT' || f.id === 'smiles')) {
          fields.push(f.id);
        }
      });
    });
    return fields;
  };

  const handleSubmit = (e) => {
    let searchField = searchInputType as string;
    if (searchInputType === MaterialsInputType.MP_ID) {
      let mpIdFilter: Filter | undefined;
      state.filterGroups.forEach((g) => {
        if (!mpIdFilter) {
          mpIdFilter = g.filters.find((f) => {
            return f.type === 'MATERIALS_INPUT' && f.props.inputType === 'mp_id';
          });
        }
      });
      searchField = mpIdFilter ? mpIdFilter.id : 'task_ids';
    }
    actions.setFilterWithOverrides(searchValue, searchField, getFieldsToOverride(searchInputType));
  };

  /**
   * This effect clears the search value if its corresponding filter value changes.
   * This ensures the search value is not contradicted by the filter value.
   */
  useEffect(() => {
    if (state.filterValues[searchInputType] !== searchValue) {
      setSearchValue('');
    }
  }, [state.filterValues]);

  return (
    <MaterialsInput
      value={searchValue}
      inputType={searchInputType}
      onChange={(v) => setSearchValue(v)}
      onInputTypeChange={(field) => setSearchInputType(field)}
      onSubmit={handleSubmit}
      periodicTableMode="toggle"
      hidePeriodicTable={shouldHidePeriodicTable()}
      autocompleteFormulaUrl={state.autocompleteFormulaUrl}
      autocompleteApiKey={state.apiKey}
      allowSmiles={allowSmiles}
      tooltip={state.searchBarTooltip}
      placeholder={state.searchBarPlaceholder}
    />
  );
};
