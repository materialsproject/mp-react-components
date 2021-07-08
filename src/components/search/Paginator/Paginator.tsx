import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaAngleDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import { getPageCount } from '../utils';
import * as d3 from 'd3';
import './Paginator.css';

interface Props {
  rowsPerPage: number;
  rowCount: number;
  onChangePage: (page: number) => any;
  onChangeRowsPerPage?: (rowsPerPage: number) => any;
  currentPage: number;
}

export const Paginator: React.FC<Props> = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  onChangeRowsPerPage,
  currentPage
}) => {
  const [pageCount, setPageCount] = useState(getPageCount(rowCount, rowsPerPage));

  const getPaginationItem = (pageNumber: number) => {
    const isCurrent = currentPage === pageNumber;
    return (
      <li key={pageNumber}>
        <a
          className={classNames('pagination-link', { 'is-current': isCurrent })}
          aria-label={isCurrent ? `Go to page ${pageNumber}` : `Page ${pageNumber}`}
          onClick={() => onChangePage(pageNumber)}
        >
          {d3.format(',')(pageNumber)}
        </a>
      </li>
    );
  };

  const pageIsUnderFour = (
    <ul className="pagination-list">
      {getPaginationItem(1)}
      {getPaginationItem(2)}
      {getPaginationItem(3)}
      {getPaginationItem(4)}
      <li>
        <span className="pagination-ellipsis">&hellip;</span>
      </li>
      {getPaginationItem(pageCount)}
    </ul>
  );

  const pageIsFourOrMore = (
    <ul className="pagination-list">
      {getPaginationItem(1)}
      <li>
        <span className="pagination-ellipsis">&hellip;</span>
      </li>
      {getPaginationItem(currentPage - 1)}
      {getPaginationItem(currentPage)}
      {getPaginationItem(currentPage + 1)}
      <li>
        <span className="pagination-ellipsis">&hellip;</span>
      </li>
      {getPaginationItem(pageCount)}
    </ul>
  );

  const pageIsWithinFourOfLast = (
    <ul className="pagination-list">
      {getPaginationItem(1)}
      <li>
        <span className="pagination-ellipsis">&hellip;</span>
      </li>
      {getPaginationItem(pageCount - 3)}
      {getPaginationItem(pageCount - 2)}
      {getPaginationItem(pageCount - 1)}
      {getPaginationItem(pageCount)}
    </ul>
  );

  let paginationItems = pageIsFourOrMore;

  if (pageCount < 6) {
    let listItems: JSX.Element[] = [];
    for (let index = 0; index < pageCount; index++) {
      listItems.push(getPaginationItem(index + 1));
    }
    paginationItems = <ul className="pagination-list">{listItems}</ul>;
  } else if (currentPage < 4) {
    paginationItems = pageIsUnderFour;
  } else if (currentPage > pageCount - 3) {
    paginationItems = pageIsWithinFourOfLast;
  }

  const resultsPerPageOptions = [10, 15, 30, 50, 75];
  const resultsPerPageMenu = (
    <MenuWrapper
      data-testid="results-per-page-menu"
      className="dropdown is-active is-hidden-touch"
      onSelection={onChangeRowsPerPage}
    >
      <div className="dropdown-trigger">
        <Button className="button is-small">
          <span>{rowsPerPage} / page</span>
          <span className="icon">
            <FaAngleDown />
          </span>
        </Button>
      </div>
      <Menu className="dropdown-menu">
        <ul className="dropdown-content">
          {resultsPerPageOptions.map((d, i) => (
            <MenuItem key={i} value={d}>
              <li className={classNames('dropdown-item', { 'is-active': d === rowsPerPage })}>
                {d}
              </li>
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </MenuWrapper>
  );

  const jumpToPageOptions = Array(pageCount)
    .fill(null)
    .map((_, i) => i + 1);
  const jumpToPageMenu = (
    <MenuWrapper
      data-testid="mpc-jump-to-page-menu"
      className="dropdown is-active is-hidden-touch"
      onSelection={onChangePage}
    >
      <div className="dropdown-trigger">
        <Button className="button is-small">
          <span>Jump to</span>
          <span className="icon">
            <FaAngleDown />
          </span>
        </Button>
      </div>
      <Menu className="dropdown-menu">
        <ul className="dropdown-content">
          {jumpToPageOptions.map((d, i) => (
            <MenuItem key={i} value={d}>
              <li className="dropdown-item">{d}</li>
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </MenuWrapper>
  );

  /**
   * This effect handles changes to rowsPerPage prop
   * that occur outside this component
   */
  useEffect(() => {
    setPageCount(getPageCount(rowCount, rowsPerPage));
  }, [rowsPerPage]);

  return (
    <div data-testid="mpc-paginator" className="mpc-paginator">
      <nav className="pagination is-small is-centered" role="navigation" aria-label="pagination">
        <button
          className="pagination-previous"
          disabled={currentPage === 1}
          aria-hidden={currentPage === 1}
          onClick={() => onChangePage(currentPage - 1)}
        >
          <FaArrowLeft />
          <span className="ml-1 is-hidden-touch">Previous</span>
        </button>
        <button
          className="pagination-next"
          disabled={currentPage === pageCount}
          aria-hidden={currentPage === pageCount}
          onClick={() => onChangePage(currentPage + 1)}
        >
          <span className="mr-1 is-hidden-touch">Next</span>
          <FaArrowRight />
        </button>
        {paginationItems}
      </nav>
      <div>
        {jumpToPageMenu}
        {resultsPerPageMenu}
      </div>
    </div>
  );
};
