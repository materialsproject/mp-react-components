import React, { useState, useEffect, useRef } from 'react';
import { useElements } from '../../periodic-table/periodic-table-state/table-store';
import { TABLE_DICO_V2 } from '../../periodic-table/periodic-table-data/table-v2';
import { getDelimiter } from '../../utils/search';

export const SearchBar = () => {
  const { enabledElements, actions } = useElements();
  const [searchInput, setSearchInput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [isFocused, setIsFocused] = useState(false);
  const getElementsList = () => Object.keys(enabledElements).filter(el => enabledElements[el]);

  function handleChange(event) {
    console.log(event.target.value);
    setSearchInput(event.target.value);
    const newDelimiter = getDelimiter(event.target.value);
    setDelimiter(newDelimiter);
    console.log(delimiter);
    const cleanedInput = event.target.value.replace(/and|\s|[0-9]/gi, '');
    if(newDelimiter) {
      const inputSplit = cleanedInput.split(newDelimiter);
      console.log(inputSplit);
      const newEnabledElements = {};
      inputSplit.forEach((d: string) => {
        if(TABLE_DICO_V2[d]) newEnabledElements[d] = true;
      });
      actions.setEnabledElements(newEnabledElements);
    }
  }

  function handleFocus(event) {
    setIsFocused(true);
  }

  function handleBlur(event) {
    setIsFocused(false);
  }

  useEffect(() => {
    if(!isFocused) {
      console.log(enabledElements);
      setSearchInput(getElementsList().toString().replace(/,/gi, delimiter));
    }
  }, [enabledElements]);

  return (
    <div>
      <input 
        type="text" 
        value={searchInput}
        onChange={handleChange}
        onFocus={handleFocus} 
        onBlur={handleBlur}
      />
    </div>
  );
};