import React, { useState, useEffect } from 'react';
import { MaterialsInput } from '../../../data-entry/MaterialsInput';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { MaterialsInputType } from '../../../data-entry/MaterialsInput';
import { Filter } from '../types';
import { MaterialsInputTypesMap } from '../../../data-entry/MaterialsInput/utils';
import { convertMaterialsInputTypesMapToArray, mapInputTypeToField } from '../utils';
import { capitalize, pluralize } from '../../../data-entry/utils';
import { InputHelpItem } from '../../../data-entry/MaterialsInput/InputHelp/InputHelp';
import { PeriodicTableMode } from '../../../data-entry/MaterialsInput/MaterialsInput';

export interface SearchUISearchBarProps {
  /**
   * Class name(s) to add to the input field
   * @default 'is-medium'
   */
  className?: string;

  /**
   * Optionally add a string of text to show up in the top-level search bar
   */
  placeholder?: string;

  /**
   * Custom error message to display with the top-level search bar
   * if the user types an invalid value
   */
  errorMessage?: string;

  /**
   * Object with keys of allowed input types for the top-level search bar.
   * Keys must be one of these supported input types: "elements", "formula", "mpid", "smiles", "text."
   * Each key object must have a "field" property which maps the input type
   * to a valid data filter field in the API.
   * 
   * e.g.
     
     {
       formula: {
         field: 'formula'
       },
       elements: {
         field: 'elements'
       },
       mpid: {
         field: 'material_ids'
       }
     }
   */
  allowedInputTypesMap?: MaterialsInputTypesMap;

  /**
   * Modes for showing the periodic table with the top search bar
   * "toggle": render a button for toggling visibility of periodic table
   * "focus": show periodic table when input is focuses, hide on blur
   * "none": never show the periodic table for this input
   * @default 'toggle'
   */
  periodicTableMode?: PeriodicTableMode;

  /**
   * Search examples to include below the search bar input.
   * This will display when input is in focus and empty, or when the help button is clicked.
   * Expects an array of items with the following properties:
   * "label": text to display before examples. If only "label" and no "examples", text will render as small.
   * "examples": array of input examples. These will become clickable and will update the input value. 
   * e.g.
     [
       {
         label: 'Search Examples'
       },
       {
         label: 'Include at least elements',
         examples: ['Li,Fe', 'Si,O,K']
       }
     ]
   */
  helpItems?: InputHelpItem[];

  /**
   * Text to display in the periodic table help box when
   * the chemical system selection mode is selected.
   * Supports markdown.
   */
  chemicalSystemSelectHelpText?: string;

  /**
   * Text to display in the periodic table help box when
   * the elements selection mode is selected.
   * Supports markdown.
   */
  elementsSelectHelpText?: string;
}

/**
 * A specific version of the MaterialsInput component used within the SearchUI component
 * for performing top level searches by mp-id, formula, or elements.
 * The input value is parsed into its appropriate search field upon submission.
 */
export const SearchUISearchBar: React.FC<SearchUISearchBarProps> = ({
  className = 'is-medium',
  ...otherProps
}) => {
  const props = { className, ...otherProps };
  const actions = useSearchUIContextActions();
  const { state, query } = useSearchUIContext();
  const allowedInputTypesMap = props.allowedInputTypesMap!;
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
  // useEffect(() => {
  //   if (state.filterValues[searchField] !== searchValue) {
  //     setSearchValue('');
  //   }
  // }, [state.filterValues]);

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
    console.log(state.searchBarValue);
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
      periodicTableMode={props.periodicTableMode}
      hidePeriodicTable={shouldHidePeriodicTable()}
      autocompleteFormulaUrl={state.autocompleteFormulaUrl}
      autocompleteApiKey={state.apiKey}
      placeholder={props.placeholder}
      allowedInputTypes={convertMaterialsInputTypesMapToArray(allowedInputTypesMap)}
      errorMessage={props.errorMessage}
      inputClassName={props.className}
      helpItems={props.helpItems}
      chemicalSystemSelectHelpText={props.chemicalSystemSelectHelpText}
      elementsSelectHelpText={props.elementsSelectHelpText}
      loading={state.loading}
    />
  );
};
