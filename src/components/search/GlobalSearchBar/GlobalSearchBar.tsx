import React, { useState } from 'react';
import { linkOnClick } from '../../../utils/utils';
import { MaterialsInput, MaterialsInputType } from '../MaterialsInput';

/**
 * A specific version of the MaterialsInput component used within the SearchUI component
 * for performing top level searches by mp-id, formula, or elements.
 * The input value is parsed into its appropriate search inputType upon submission.
 */

interface Props {
  redirectRoute: string;
  hidePeriodicTable?: boolean;
  autocompleteFormulaUrl?: string;
  apiKey?: string;
  tooltip?: string;
  placeholder?: string;
}

export const GlobalSearchBar: React.FC<Props> = (props) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchInputType, setSearchInputType] = useState(MaterialsInputType.ELEMENTS);

  const handleSubmit = (e: React.FormEvent | React.MouseEvent, value?: string) => {
    let query = new URLSearchParams();
    query.set(searchInputType, searchValue);
    const href = props.redirectRoute + '?' + query.toString();
    linkOnClick(e, href);
  };

  return (
    <MaterialsInput
      value={searchValue}
      inputType={searchInputType}
      onChange={(v) => setSearchValue(v)}
      onInputTypeChange={(inputType) => setSearchInputType(inputType)}
      onSubmit={handleSubmit}
      periodicTableMode="toggle"
      hidePeriodicTable={props.hidePeriodicTable}
      autocompleteFormulaUrl={props.autocompleteFormulaUrl}
      autocompleteApiKey={props.apiKey}
      tooltip={props.tooltip}
      placeholder={props.placeholder}
    />
  );
};
