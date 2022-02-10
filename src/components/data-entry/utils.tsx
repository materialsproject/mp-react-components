import React from 'react';
import * as XLSX from 'xlsx';
import { TABLE_DICO_V2 } from '../periodic-table/periodic-table-data/table-v2';
import * as d3 from 'd3';
import { spaceGroups } from '../../constants/spaceGroups';
import { pointGroups } from '../../constants/pointGroups';

export enum DownloadType {
  JSON = 'json',
  CSV = 'csv',
  EXCEL = 'xlsx'
}

type DownloadTypeObject = Partial<Record<DownloadType, any>>;

export const convertArrayOfObjectsToCSV = (array: any[]) => {
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
};

export const downloadCSV = (array: any[], filename?: string) => {
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return false;
  const name = filename ? filename + '.csv' : 'export.csv';
  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }
  createLink(csv, name);
  return true;
};

export const createLink = (dataStr: string, filename: string) => {
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(dataStr));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadJSON = (data: any, filename?: string) => {
  const jsonDataStr = 'data:text/json;charset=utf-8,' + JSON.stringify(data);
  if (data) {
    const name = filename ? filename + '.json' : 'export.json';
    createLink(jsonDataStr, name);
    return true;
  }
  return false;
};

export const downloadExcel = (array: any[], filename?: string) => {
  // export json to Worksheet of Excel only array possible
  const wks = XLSX.utils.json_to_sheet(array);
  // A workbook is the name given to an Excel file
  const wb = XLSX.utils.book_new(); // make Workbook of Excel
  // add Worksheet to Workbook
  // Workbook contains one or more worksheets
  const name = filename ? filename : 'export';
  XLSX.utils.book_append_sheet(wb, wks, name); // sheetAName is name of Worksheet
  // export Excel file
  XLSX.writeFile(wb, name + '.xlsx'); // name of the file is 'book.xlsx'
  return true;
};

export const downloadAs: DownloadTypeObject = {
  json: downloadJSON,
  csv: downloadCSV,
  xlsx: downloadExcel
};

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

/**
 * Split formula string into two kinds of arrays:
 * 1. One with numbers e.g. [Eu2, Si, N3]
 * 2. One without numbers e.g. [Eu, Si, N]
 *
 * Wildcards are included as elements e.g. [Eu, Si, N, *, *]
 */
export function formulaStringToArrays(str: string) {
  var formulaSplitWithNumbers = str.match(/[A-Z][a-z][0-9]|[A-Z][0-9]|[A-Z][a-z]|[A-Z]|\*/g);
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

  const trailingDelimiter = arr.length === 1 ? delimiter : '';

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
      label: g['int_number']
    };
  });
};

export const spaceGroupSymbolOptions = () => {
  return spaceGroups.map((g) => {
    return {
      value: g['symbol'],
      label: g['symbol_unicode']
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
      label: d.key
    };
  });
};

export const pointGroupOptions = () => {
  return pointGroups.map((val) => {
    return {
      value: val,
      label: val
    };
  });
};

export const pluralize = (noun) => {
  let plural = noun + 's';
  const specialNouns = {
    battery: 'batteries',
    spectrum: 'spectra'
  };
  if (specialNouns[noun]) plural = specialNouns[noun];
  return plural;
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export const sortDynamic = (field, asc?) => {
  const sortDirection = asc ? 1 : -1;
  return (a, b) => {
    const result = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
    return result * sortDirection;
  };
};

export const sortCrossref = (field, asc?) => {
  const sortDirection = asc ? 1 : -1;
  return (a, b) => {
    let result = 0;
    switch (field) {
      case 'year':
        result =
          a.created.timestamp < b.created.timestamp
            ? -1
            : a.created.timestamp > b.created.timestamp
            ? 1
            : 0;
        break;
      case 'author':
        result =
          a.author[0].family < b.author[0].family
            ? -1
            : a.author[0].family > b.author[0].family
            ? 1
            : 0;
        break;
      case 'title':
        result = a.title[0] < b.title[0] ? -1 : a.title[0] > b.title[0] ? 1 : 0;
        break;
      default:
        result = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
    }
    return result * sortDirection;
  };
};

export function mapArrayToBooleanObject(array: any, value: boolean = true) {
  if (Array.isArray(array)) {
    return array.reduce((acc, id) => {
      acc[id] = value;
      return acc;
    }, {});
  } else {
    return array;
  }
}

export const validateValueInRange = (value: number, min: number, max: number): number => {
  if (value > max) {
    return max;
  } else if (value < min) {
    return min;
  } else {
    return value;
  }
};

export const convertToNumber = (value: number | string): number => {
  if (typeof value === 'string') {
    return parseFloat(value);
  } else {
    return value;
  }
};

export const initSliderScale = (domain: number[], isLogScale?: boolean) => {
  if (isLogScale) {
    return d3.scaleLog().domain([Math.pow(10, domain[0]), Math.pow(10, domain[1])]);
  } else {
    return d3.scaleLinear().domain(domain).nice();
  }
};

export const initSliderTicks = (ticks: number | null, domain: number[], scale?: any) => {
  if (ticks === 2) {
    return domain;
  } else if (ticks !== null) {
    return scale.ticks(ticks);
  } else {
    return;
  }
};

/**
 * Convert value to 10^value and handle the amount of decimals to fix the number to.
 * For exponents 0 or more, only show whole numbers.
 * For exponents less than 0, the exponent value will determine the number of decimals
 * (e.g. -1 -> 1 decimal place, -1.3 -> 2 decimal places).
 */
export const pow10Fixed = (value: number): string => {
  if (value < 0) {
    return Math.pow(10, value).toFixed(Math.ceil(Math.abs(value)));
  } else {
    return Math.pow(10, value).toFixed();
  }
};
