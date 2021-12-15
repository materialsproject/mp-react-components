import React, { useState, useEffect } from 'react';
import { MaterialsInput } from '../../../data-entry/MaterialsInput';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { MaterialsInputType } from '../../../data-entry/MaterialsInput';
import { Filter } from '../types';
import { MaterialsInputTypesMap } from '../../../data-entry/MaterialsInput/utils';
import { convertMaterialsInputTypesMapToArray, mapInputTypeToField } from '../utils';
import { capitalize, pluralize } from '../../../data-entry/utils';

/**
 * A specific version of the MaterialsInput component used within the SearchUI component
 * for performing top level searches by mp-id, formula, or elements.
 * The input value is parsed into its appropriate search field upon submission.
 */
export const SearchUISearchBar: React.FC = () => {
  const actions = useSearchUIContextActions();
  const state = useSearchUIContext();
  const allowedInputTypesMap = state.searchBarAllowedInputTypesMap!;
  const [searchValue, setSearchValue] = useState(state.searchBarValue || '');
  const initialInputType = convertMaterialsInputTypesMapToArray(allowedInputTypesMap)[0];
  const [searchInputType, setSearchInputType] = useState<MaterialsInputType>(initialInputType);
  const [searchField, setSearchField] = useState(() =>
    mapInputTypeToField(searchInputType, allowedInputTypesMap)
  );

  const shouldHidePeriodicTable = () => {
    if (state.activeFilters && state.activeFilters.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent | React.MouseEvent, value?: string) => {
    console.log(value);
    const submitValue = value || searchValue;
    const allowedFields = Object.keys(allowedInputTypesMap).map((d) => {
      return allowedInputTypesMap[d].field;
    });
    const fieldsToOverride = allowedFields?.filter((d) => d !== searchField);
    actions.setFilterValue(submitValue, searchField, fieldsToOverride);
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

  /**
   * Map searchInputType to its corresponding data field
   */
  useEffect(() => {
    setSearchField(mapInputTypeToField(searchInputType, allowedInputTypesMap));
  }, [searchInputType]);

  /**
   * Update the search bar value if it's changed from outside this component
   * (e.g. from the url on load or from a linked filter in the filters panel).
   */
  useEffect(() => {
    setSearchValue(state.searchBarValue || '');
  }, [state.searchBarValue]);

  return (
    <MaterialsInput
      value={searchValue}
      label={capitalize(pluralize(state.resultLabel))}
      type={searchInputType}
      onChange={(v) => setSearchValue(v)}
      onInputTypeChange={(field) => setSearchInputType(field)}
      onSubmit={handleSubmit}
      showSubmitButton={true}
      periodicTableMode={state.searchBarPeriodicTableMode}
      hidePeriodicTable={shouldHidePeriodicTable()}
      autocompleteFormulaUrl={state.autocompleteFormulaUrl}
      autocompleteApiKey={state.apiKey}
      placeholder={state.searchBarPlaceholder}
      allowedInputTypes={convertMaterialsInputTypesMapToArray(allowedInputTypesMap)}
      errorMessage={state.searchBarErrorMessage}
      inputClassName="is-medium"
      helpItems={state.searchBarHelpItems}
    />
  );
};
