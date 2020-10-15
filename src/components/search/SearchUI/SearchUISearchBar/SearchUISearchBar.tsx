import React, { useState, useEffect } from 'react';
import { MaterialsInput } from '../../MaterialsInput';
import { useSearchUIContextActions } from '../context/SearchUIContextProvider';

export const SearchUISearchBar: React.FC = () => {
  const actions = useSearchUIContextActions();
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchParsedValue, setSearchParsedValue] = useState<string | string[]>('');
  const [searchField, setSearchField] = useState<string>('elements');

  return (
    <MaterialsInput
      value={searchValue}
      parsedValue={searchParsedValue}
      field={searchField}
      onChange={v => setSearchValue(v)}
      onParsedValueChange={parsedValue => setSearchParsedValue(parsedValue)}
      onFieldChange={field => setSearchField(field)}
      onSubmit={() => actions.resetAllFiltersExcept(searchValue, searchField)}
      periodicTableMode="toggle"
    />
  );
};
