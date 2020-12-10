import React, { useState, useEffect } from 'react';
import { MaterialsInput } from '../../MaterialsInput';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { MaterialsInputField } from '../../MaterialsInput';

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
  const [searchField, setSearchField] = useState<string>(state.topLevelSearchField);
  const allowSmiles = state.resultLabel === 'molecule';

  const shouldHidePeriodicTable = () => {
    if (state.activeFilters && state.activeFilters.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  const getFieldsToOverride = (selectedField: string) => {
    let fields: string[] = [];
    Object.values(MaterialsInputField).forEach((field) => {
      if (field !== selectedField) fields.push(field);
    });
    return fields;
  };

  const handleSubmit = () => {
    actions.setFilterWithOverrides(searchValue, searchField, getFieldsToOverride(searchField));
  };

  /**
   * This effect clears the search value if its corresponding filter value changes.
   * This ensures the search value is not contradicted by the filter value.
   */
  useEffect(() => {
    if (state.filterValues[searchField] !== searchValue) {
      setSearchValue('');
    }
  }, [state.filterValues]);

  return (
    <MaterialsInput
      value={searchValue}
      field={searchField}
      onChange={v => setSearchValue(v)}
      onFieldChange={field => setSearchField(field)}
      onSubmit={handleSubmit}
      periodicTableMode="toggle"
      hidePeriodicTable={shouldHidePeriodicTable()}
      autocompleteFormulaUrl={state.autocompleteFormulaUrl}
      autocompleteApiKey={state.apiKey}
      allowSmiles={allowSmiles}
      tooltip={state.searchBarTooltip}
    />
  );
};
