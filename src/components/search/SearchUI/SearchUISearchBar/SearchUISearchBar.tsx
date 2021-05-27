import React, { useState, useEffect } from 'react';
import { MaterialsInput } from '../../MaterialsInput';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { MaterialsInputType } from '../../MaterialsInput';
import { Filter } from '../types';
import { MaterialsInputTypesMap } from '../../MaterialsInput/utils';
import { convertMaterialsInputTypesMapToArray, mapInputTypeToField } from '../utils';

/**
 * A specific version of the MaterialsInput component used within the SearchUI component
 * for performing top level searches by mp-id, formula, or elements.
 * The input value is parsed into its appropriate search field upon submission.
 */
export const SearchUISearchBar: React.FC = () => {
  const actions = useSearchUIContextActions();
  const state = useSearchUIContext();
  const allowedInputTypesMap = state.searchBarAllowedInputTypesMap!;
  const [searchValue, setSearchValue] = useState<string>('');
  const initialInputType = convertMaterialsInputTypesMapToArray(allowedInputTypesMap)[0];
  const [searchInputType, setSearchInputType] = useState<MaterialsInputType>(initialInputType);
  const [searchField, setSearchField] = useState(() =>
    mapInputTypeToField(searchInputType, allowedInputTypesMap)
  );
  const allowSmiles = state.resultLabel === 'molecule';

  const shouldHidePeriodicTable = () => {
    if (state.activeFilters && state.activeFilters.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent | React.MouseEvent, value?: string) => {
    const submitValue = value || searchValue;
    const allowedFields = Object.keys(allowedInputTypesMap).map((d) => {
      return allowedInputTypesMap[d].field;
    });
    const fieldsToOverride = allowedFields?.filter((d) => d !== searchField);
    actions.setFilterWithOverrides(submitValue, searchField, fieldsToOverride);
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

  return (
    <MaterialsInput
      value={searchValue}
      inputType={searchInputType}
      onChange={(v) => setSearchValue(v)}
      onInputTypeChange={(field) => setSearchInputType(field)}
      onSubmit={handleSubmit}
      periodicTableMode={state.searchBarPeriodicTableMode}
      hidePeriodicTable={shouldHidePeriodicTable()}
      autocompleteFormulaUrl={state.autocompleteFormulaUrl}
      autocompleteApiKey={state.apiKey}
      allowSmiles={allowSmiles}
      tooltip={state.searchBarTooltip}
      placeholder={state.searchBarPlaceholder}
      allowedInputTypes={convertMaterialsInputTypesMapToArray(allowedInputTypesMap)}
      errorMessage={state.searchBarErrorMessage}
    />
  );
};
