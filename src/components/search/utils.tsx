import React from 'react';
import * as XLSX from 'xlsx';
import { TABLE_DICO_V2 } from '../periodic-table/periodic-table-data/table-v2';
import * as d3 from 'd3';
import { spaceGroups } from '../../constants/spaceGroups';
import { pointGroups } from '../../constants/pointGroups';

export function convertArrayOfObjectsToCSV(array) {
  let result;
  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  const keys = Object.keys(array[0]);
  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;
  array.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;
      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

export function downloadCSV(array) {
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return false;
  const filename = 'export.csv';
  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }
  createLink(csv, filename);
  return true;
}

export function createLink(data, filename) {
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(data));
  link.setAttribute('download', filename);
  link.click();
}

export function downloadJSON(array) {
  const jsonDataStr = 'data:text/json;charset=utf-8,' + JSON.stringify(array);
  if (array) {
    createLink(jsonDataStr, 'export.json');
    return true;
  }
  return false;
}

export function downloadExcel(array) {
  // export json to Worksheet of Excel only array possible
  const wks = XLSX.utils.json_to_sheet(array);
  // A workbook is the name given to an Excel file
  const wb = XLSX.utils.book_new(); // make Workbook of Excel
  // add Worksheet to Workbook
  // Workbook contains one or more worksheets
  XLSX.utils.book_append_sheet(wb, wks, 'materials'); // sheetAName is name of Worksheet
  // export Excel file
  XLSX.writeFile(wb, 'material.xlsx'); // name of the file is 'book.xlsx'
  return true;
}

/**
 * Determine if a string is delimited by commas, hyphens, or spaces
 * Return the delimiter as a regular expression object
 * If multiple delimiters are present, the delimiter with the lowest index is used
 */
export const getDelimiter = (input: string): RegExp | undefined => {
  const comma = input.match(/,/);
  const hyphen = input.match(/-/);
  const space = input.match(/\s/);
  if (
    comma &&
    comma.index &&
    (!hyphen || (hyphen.index && hyphen.index > comma.index)) &&
    (!space || (space.index && space.index > comma.index))
  ) {
    return new RegExp(',');
  } else if (
    hyphen &&
    hyphen.index &&
    (!comma || (comma.index && comma.index > hyphen.index)) &&
    (!space || (space.index && space.index > hyphen.index))
  ) {
    return new RegExp('-');
  } else if (
    space &&
    space.index &&
    (!comma || (comma.index && comma.index > space.index)) &&
    (!hyphen || (hyphen.index && space.index > space.index))
  ) {
    return new RegExp(/\s/);
  } else {
    return;
  }
};

export function elementsArrayToElementState(elements: string[]) {
  const elementState = {};
  elements.forEach((d: string) => {
    if (TABLE_DICO_V2[d]) elementState[d] = true;
  });
  return elementState;
}

export function formulaStringToArrays(str: string) {
  var formulaSplitWithNumbers = str.match(/[A-Z][a-z][0-9]|[A-Z][0-9]|[A-Z][a-z]|[A-Z]/g);
  var formulaSplitElementsOnly = formulaSplitWithNumbers
    ? formulaSplitWithNumbers.map((d) => d.replace(/[0-9]/, ''))
    : [];
  return { formulaSplitWithNumbers, formulaSplitElementsOnly };
}

export function getTruthyKeys(obj: any) {
  return obj ? Object.keys(obj).filter((key) => obj[key]) : [];
}

export function arrayToDelimitedString(arr: any[], delimiter: string | RegExp = ',') {
  delimiter = delimiter.toString();
  if (delimiter.indexOf('s') > -1) {
    delimiter = ' ';
  } else if (delimiter.indexOf('/') === 0) {
    delimiter = delimiter.replace(/\//g, '');
  }
  return arr.toString().replace(/,/gi, delimiter);
}

export const countDecimals = (value: number) => {
  let text = value.toString();
  // verify if number 0.000005 is represented as "5e-6"
  if (text.indexOf('e-') > -1) {
    let [base, trail] = text.split('e-');
    let deg = parseInt(trail, 10);
    return deg;
  }
  // count decimals for number in representation like "0.123456"
  if (Math.floor(value) !== value) {
    return value.toString().split('.')[1].length || 0;
  }
  return 0;
};

export const initArray = (length: number, value: any) => {
  let arr: any[] = [];
  while (length--) arr[length] = value;
  return arr;
};

export const spaceGroupNumberOptions = () => {
  return spaceGroups.map((g) => {
    return {
      value: g['int_number'],
      label: g['int_number'],
    };
  });
};

export const spaceGroupSymbolOptions = () => {
  return spaceGroups.map((g) => {
    return {
      value: g['symbol'],
      label: g['symbol_unicode'],
    };
  });
};

export const crystalSystemOptions = () => {
  var spaceGroupsByCrystalSystem = d3
    .nest()
    .key((d: any) => d.crystal_system)
    .entries(spaceGroups);

  return spaceGroupsByCrystalSystem.map((d) => {
    return {
      value: d.key,
      label: d.key,
    };
  });
};

export const pointGroupOptions = () => {
  return pointGroups.map((val) => {
    return {
      value: val,
      label: val,
    };
  });
};

export const pluralize = (noun) => {
  let plural = noun + 's';
  const specialNouns = {
    battery: 'batteries',
  };
  if (specialNouns[noun]) plural = specialNouns[noun];
  return plural;
};

/**
 * Perform a naive validation of a string as a formula
 * Returns the string if it has more than one capital letter, a number, or wildcard character ("*")
 * Returns null if the string is not a "parsable" formula
 */
export const parseFormula = (str: string) => {
  const capitalLettersMatch = str.match(/[A-Z]/g);
  const capitalLetters = capitalLettersMatch ? capitalLettersMatch.length : 0;
  const formula = capitalLetters > 1 || str.match(/[0-9]/gi) || str.match(/\*/gi) ? str : null;
  return formula;
};

export const formatPointGroup = (pointGroup: string): JSX.Element => {
  if (pointGroup && typeof pointGroup === 'string') {
    const firstCharacter = pointGroup.substring(0, 1);
    const subCharacters = pointGroup.substring(1);
    const unicodeSubCharacters = subCharacters.replace('*', '\u221E');
    return (
      <span>
        <span>{firstCharacter}</span>
        <sub>{unicodeSubCharacters}</sub>
      </span>
    );
  } else {
    return <span></span>;
  }
};

export const formatFormula = (formula: string): JSX.Element => {
  if (formula && typeof formula === 'string') {
    const splitFormula: string[] = formula.split(/([0-9]+)/g);
    const formulaItem = (str: string) => {
      if (parseInt(str)) {
        return <sub>{str}</sub>;
      } else {
        return <span>{str}</span>;
      }
    };
    return (
      <span>
        {splitFormula.map((s, i) => (
          <span key={i}>{formulaItem(s)}</span>
        ))}
      </span>
    );
  } else {
    return <span></span>;
  }
};

/**
 * Get number of pages based on total results and page limit
 * If no results, return 1 to prevent errors with query
 */
export const getPageCount = (totalResults: number, resultsPerPage: number) => {
  if (totalResults === 0) {
    return 1;
  } else {
    return Math.ceil(totalResults / resultsPerPage);
  }
};
