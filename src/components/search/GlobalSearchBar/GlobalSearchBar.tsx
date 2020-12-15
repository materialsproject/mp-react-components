import React, { useState } from 'react';
import { linkOnClick } from '../../../utils/utils';
import { MaterialsInput } from '../MaterialsInput';

/**
 * A specific version of the MaterialsInput component used within the SearchUI component
 * for performing top level searches by mp-id, formula, or elements.
 * The input value is parsed into its appropriate search field upon submission.
 */

interface Props {
  redirectRoute: string;
  hidePeriodicTable?: boolean;
  autocompleteFormulaUrl?: string;
  apiKey?: string;
  tooltip?: string;
}

export const GlobalSearchBar: React.FC<Props> = props => {
  const [searchValue, setSearchValue] = useState('');
  const [searchField, setSearchField] = useState('elements');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    let query = new URLSearchParams();
    query.set(searchField, searchValue);
    console.log(query.toString());
    const href = props.redirectRoute + '?' + query.toString();
    linkOnClick(e, href);
  };

  return (
    <MaterialsInput
      value={searchValue}
      field={searchField}
      onChange={v => setSearchValue(v)}
      onFieldChange={field => setSearchField(field)}
      onSubmit={handleSubmit}
      periodicTableMode="toggle"
      hidePeriodicTable={props.hidePeriodicTable}
      autocompleteFormulaUrl={props.autocompleteFormulaUrl}
      autocompleteApiKey={props.apiKey}
      tooltip={props.tooltip}
    />
  );
};
