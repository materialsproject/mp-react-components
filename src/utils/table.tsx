import classNames from 'classnames';
import React from 'react';
import { ArrayChips } from '../components/data-display/ArrayChips';
import { Formula } from '../components/data-display/Formula';
import { Column, ColumnFormat } from '../components/data-display/SearchUI/types';
import { Tooltip } from '../components/data-display/Tooltip';
import { formatPointGroup } from '../components/data-entry/utils';
import { Link } from '../components/navigation/Link';
import { spaceGroups } from '../constants/spaceGroups';
import { joinUrl } from './navigation';

const emptyCellPlaceholder = '-';

/**
 * Get the corresponding value for a row object given a selector string.
 * Can select values from keys nested up to 3 levels.
 * @param selector string that corresponds to a key or nested group of keys (e.g. 'data.a.b.c') in an object.
 * @param row object that has the key(s) specified in selector
 */
export const getRowValueFromSelectorString = (selector: string, row: any) => {
  try {
    const selectors = selector.split('.');
    switch (selectors.length) {
      case 1:
        return row[selectors[0]];
      case 2:
        return row[selectors[0]][selectors[1]];
      case 3:
        return row[selectors[0]][selectors[1]][selectors[2]];
      case 4:
        return row[selectors[0]][selectors[1]][selectors[2]][selectors[3]];
      default:
        return emptyCellPlaceholder;
    }
  } catch (error) {
    return emptyCellPlaceholder;
  }
};

/**
 * Initialize columns with their proper format function
 * The "format" prop should initially be one of the ColumnFormat strings
 * which maps to one of the format (or cell) functions defined here.
 * FIXED_DECIMAL and SIGNIFICANT_FIGURES both expect another column property "formatArg"
 * that will specify how many decimals or figures to apply to the format.
 */
export const initColumns = (columns: Column[], disableRichColumnHeaders?: boolean): Column[] => {
  return columns.map((c) => {
    /** Make columns sortable by default */
    c.sortable = c.sortable !== undefined ? c.sortable : true;

    /** Automatically right align numberic columns */
    if (
      (c.formatType === ColumnFormat.FIXED_DECIMAL ||
        c.formatType === ColumnFormat.SIGNIFICANT_FIGURES) &&
      c.right !== false
    ) {
      c.right = true;
    }

    if (disableRichColumnHeaders) {
      c.name = c.hideName ? '' : c.title;
    } else {
      c.name = (
        <div
          className={classNames({
            'column-header-right': c.right,
            'column-header-center': c.center,
            'column-header-left': !c.right && !c.center,
            'tooltip-label': c.tooltip
          })}
          data-tip={c.tooltip}
          data-for={c.selector}
        >
          <div>{c.hideName ? '' : c.title}</div>
          {c.units && <div className="column-units">({c.units})</div>}
          {c.tooltip && <Tooltip id={c.selector}>{c.tooltip}</Tooltip>}
        </div>
      );
    }

    const hasFormatOptions = c.hasOwnProperty('formatOptions');

    switch (c.formatType) {
      case ColumnFormat.FIXED_DECIMAL:
        const decimalPlaces =
          hasFormatOptions && c.formatOptions.decimals ? c.formatOptions.decimals : 2;
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const numValue = parseFloat(rowValue);
          const value = c.conversionFactor ? numValue * c.conversionFactor : numValue;
          const min = Math.pow(10, -decimalPlaces);
          if (value === 0) {
            return 0;
          }
          if (hasFormatOptions && c.formatOptions.abbreviateNearZero) {
            if (value >= min) {
              return value.toFixed(decimalPlaces);
            } else if (value < min) {
              return '< ' + min.toString();
            } else {
              return emptyCellPlaceholder;
            }
          } else {
            return isNaN(value) ? emptyCellPlaceholder : value.toFixed(decimalPlaces);
          }
        };
        return c;
      case ColumnFormat.SIGNIFICANT_FIGURES:
        const sigFigs = hasFormatOptions && c.formatOptions.sigFigs ? c.formatOptions.sigFigs : 5;
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const numValue = parseFloat(rowValue);
          const value = c.conversionFactor ? numValue * c.conversionFactor : numValue;
          if (value === 0) {
            return 0;
          }
          return isNaN(value) ? emptyCellPlaceholder : value.toPrecision(sigFigs);
        };
        return c;
      case ColumnFormat.FORMULA:
        c.cell = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          return <Formula>{rowValue}</Formula>;
        };
        return c;
      case ColumnFormat.LINK:
        c.cell = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const linkLabel =
            hasFormatOptions && c.formatOptions.linkLabelKey && rowValue
              ? row[c.formatOptions.linkLabelKey]
              : rowValue;
          const isFormula = hasFormatOptions && c.formatOptions.linkLabelisFormula;
          const url =
            hasFormatOptions && c.formatOptions.baseUrl && rowValue
              ? joinUrl(c.formatOptions.baseUrl, rowValue)
              : rowValue;

          return linkLabel && url ? (
            <Link
              href={url}
              onClick={(e) => e.stopPropagation()}
              target={hasFormatOptions && c.formatOptions.target}
              preserveQuery={hasFormatOptions && c.formatOptions.preserveQuery}
            >
              {isFormula ? <Formula>{linkLabel}</Formula> : linkLabel}
            </Link>
          ) : (
            emptyCellPlaceholder
          );
        };
        return c;
      case ColumnFormat.BOOLEAN:
        var truthyLabel =
          hasFormatOptions && c.formatOptions.truthyLabel ? c.formatOptions.truthyLabel : 'true';
        var falsyLabel =
          hasFormatOptions && c.formatOptions.falsyLabel ? c.formatOptions.falsyLabel : 'false';
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          return rowValue ? truthyLabel : falsyLabel;
        };
        return c;
      case ColumnFormat.BOOLEAN_CLASS:
        var truthyClass =
          hasFormatOptions && c.formatOptions.truthyClass ? c.formatOptions.truthyClass : '';
        var falsyClass =
          hasFormatOptions && c.formatOptions.falsyClass ? c.formatOptions.falsyClass : '';
        c.cell = (row: any, i: number) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          let cleanValue = rowValue;

          if (hasFormatOptions && c.formatOptions.truthyValue !== undefined) {
            cleanValue = rowValue === c.formatOptions.truthyValue;
          }

          return (
            <span
              className="boolean-cell-wrapper"
              data-for={`${c.selector}-${i}`}
              data-tip={c.cellTooltip}
            >
              <i
                className={classNames({
                  [truthyClass]: cleanValue,
                  [falsyClass]: !cleanValue
                })}
              ></i>
              {c.cellTooltip && <Tooltip id={`${c.selector}-${i}`}>{c.cellTooltip}</Tooltip>}
            </span>
          );
        };
        return c;
      case ColumnFormat.SPACEGROUP_SYMBOL:
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const spaceGroup = spaceGroups.find((d) => d['symbol'] === rowValue);
          const formattedSymbol = spaceGroup ? spaceGroup['symbol_unicode'] : rowValue;
          return formattedSymbol;
        };
        return c;
      case ColumnFormat.POINTGROUP:
        c.cell = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          return formatPointGroup(rowValue);
        };
        return c;
      case ColumnFormat.ARRAY:
        c.cell = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          if (Array.isArray(rowValue)) {
            return (
              <ArrayChips
                chips={rowValue}
                chipTooltips={hasFormatOptions && row[c.formatOptions.arrayTooltipsKey]}
                chipLinks={hasFormatOptions && row[c.formatOptions.arrayLinksKey]}
                chipLinksTarget={hasFormatOptions && c.formatOptions.arrayLinksTarget}
                chipType={hasFormatOptions && c.formatOptions.arrayChipType}
                showDownloadIcon={hasFormatOptions && c.formatOptions.arrayLinksShowDownload}
              />
            );
          } else {
            return rowValue;
          }
        };
        return c;
      case ColumnFormat.RADIO:
        c.cell = (row: any) => {
          let rowValue = getRowValueFromSelectorString(c.selector, row);
          return <input type="radio" checked={rowValue} onChange={() => c.onChange(row)}></input>;
        };
        return c;
      default:
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const isNumber = !isNaN(rowValue);
          let value = rowValue;
          if (React.isValidElement(value)) {
            return value;
          }
          if (typeof rowValue === 'object') {
            value = JSON.stringify(rowValue);
          }
          if (c.conversionFactor && isNumber) {
            value = rowValue * c.conversionFactor;
          }
          if (value === 0) {
            return 0;
          }
          return value && value !== '' ? value : emptyCellPlaceholder;
        };
        return c;
    }
  });
};

export const getColumnsFromKeys = (data: object): Column[] => {
  const keys = Object.keys(data);
  return keys.map((key) => {
    return {
      title: key,
      selector: key
    };
  });
};
