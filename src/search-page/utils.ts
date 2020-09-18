import * as XLSX from 'xlsx';
import { TABLE_DICO_V2 } from '../periodic-table/periodic-table-data/table-v2';

export function convertArrayOfObjectsToCSV(array) {
  let result;
  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  const keys = Object.keys(array[0]);
  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;
  array.forEach(item => {
    let ctr = 0;
    keys.forEach(key => {
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
  console.log(array);
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

export function getDelimiter(str: string): string {
  const commaIndex = str.indexOf(',');
  const hyphenIndex = str.indexOf('-');
  if(commaIndex > -1 && hyphenIndex > -1) {
    return commaIndex < hyphenIndex ? ',' : '-';
  } else if(commaIndex === -1 && hyphenIndex > -1) {
    return '-';
  } else {
    return ',';
  }
}

export function elementsArrayToElementState(elements: string[]) {
  const elementState = {};
  elements.forEach((d: string) => {
    if(TABLE_DICO_V2[d]) elementState[d] = true;
  });
  return elementState;
}

export function formulaStringToArrays(str: string) {
  var formulaSplitWithNumbers = str.match(/[A-Z][a-z][0-9]|[A-Z][0-9]|[A-Z][a-z]|[A-Z]/g);
  var formulaSplitElementsOnly = formulaSplitWithNumbers ? formulaSplitWithNumbers.map((d) => d.replace(/[0-9]/, '')) : [];
  return { formulaSplitWithNumbers, formulaSplitElementsOnly };
}

export function getTruthyKeys(obj: any) {
  return obj ? Object.keys(obj).filter(key => obj[key]) : [];
}

