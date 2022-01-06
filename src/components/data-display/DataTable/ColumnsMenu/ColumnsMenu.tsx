import classNames from 'classnames';
import React, { ReactNode, useRef, useState } from 'react';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import { FaAngleDown } from 'react-icons/fa';
import { Column } from '../../SearchUI/types';

interface ColumnsMenuProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;
  /**
   * Class name(s) to append to the component's default class (`mpc-data-block`)
   */
  className?: string;
  /**
   * An array of column definition objects to control how keys/values are rendered in the data block.
   * See `Column` documentation for specifics on how to construct `Column` objects.
   * If no column definitions are supplied, the key names are used as labels and the values are rendered
   * without any formatting.
   */
  columns: Column[];
  setColumns: (columns: Column[]) => any;
}

/**
 * Component for displaying a single row (object) of data in a card-like block.
 * Blocks have a top section that displays data horizontally and an optional collapsible bottom
 * section that displays data vertically.
 */
export const ColumnsMenu: React.FC<ColumnsMenuProps> = (props) => {
  const [allCollumnsSelected, setAllCollumnsSelected] = useState(() => {
    const anyNotSelected = props.columns.find((col) => col.omit);
    return !anyNotSelected;
  });

  const toggleColumn = (columnIndex: number) => {
    const newColumns = [...props.columns];
    const changedColumn = newColumns[columnIndex];
    if (changedColumn) changedColumn.omit = !changedColumn.omit;
    const anyNotSelected = newColumns.find((col) => col.omit);
    setAllCollumnsSelected(!anyNotSelected);
    props.setColumns(newColumns);
  };

  const toggleAllColumns = () => {
    const newAllColumnsSelected = !allCollumnsSelected;
    const newColumns = props.columns.map((col) => {
      col.omit = !newAllColumnsSelected;
      return col;
    });
    setAllCollumnsSelected(newAllColumnsSelected);
    props.setColumns(newColumns);
  };

  return (
    <MenuWrapper
      data-testid="columns-menu"
      className="dropdown is-right is-active"
      closeOnSelection={false}
    >
      <div className="dropdown-trigger">
        <Button className="button">
          <span>Columns</span>
          <span className="icon">
            <FaAngleDown />
          </span>
        </Button>
      </div>
      <Menu className="dropdown-menu">
        <ul className="dropdown-content">
          <MenuItem>
            <li className="dropdown-item">
              <label className="checkbox is-block">
                <input
                  type="checkbox"
                  role="checkbox"
                  checked={allCollumnsSelected}
                  aria-checked={allCollumnsSelected}
                  /**
                   * Use key-up event to allow toggling with the space bar
                   * Must use key-up instead of key-down to prevent double-firing in Firefox
                   */
                  onKeyUp={(e) => {
                    e.preventDefault();
                    if (e.keyCode === 32) toggleAllColumns();
                  }}
                  onChange={(e) => toggleAllColumns()}
                />
                <span>
                  <strong>Select all</strong>
                </span>
              </label>
            </li>
          </MenuItem>
          {props.columns.map((col, i) => (
            <MenuItem key={i}>
              <li className="dropdown-item">
                <label className="checkbox is-block">
                  <input
                    type="checkbox"
                    role="checkbox"
                    checked={!col.omit}
                    aria-checked={!col.omit}
                    /**
                     * Use key-up event to allow toggling with the space bar
                     * Must use key-up instead of key-down to prevent double-firing in Firefox
                     */
                    onKeyUp={(e) => {
                      e.preventDefault();
                      if (e.keyCode === 32) toggleColumn(i);
                    }}
                    onChange={(e) => toggleColumn(i)}
                  />
                  <span>{col.title}</span>
                </label>
              </li>
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </MenuWrapper>
  );
};
