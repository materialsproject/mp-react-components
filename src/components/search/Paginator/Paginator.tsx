import classNames from 'classnames';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface Props {
  rowsPerPage: number;
  rowCount: number;
  onChangePage: (page: number) => any;
  onChangeRowsPerPage: (rowsPerPage: number) => any;
  currentPage: number;
}

export const Paginator: React.FC<Props> = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  onChangeRowsPerPage,
  currentPage
}) => {
  const pageCount = Math.ceil(rowCount / rowsPerPage);

  const getPaginationItem = (pageNumber: number) => {
    const isCurrent = currentPage === pageNumber;
    return (
      <li>
        <a
          className={classNames('pagination-link', {'is-current': isCurrent})} 
          aria-label={isCurrent ? `Go to page ${pageNumber}` : `Page ${pageNumber}`}
          onClick={() => onChangePage(pageNumber)}
        >
          {pageNumber}
        </a>
      </li>
    );
  };

  const pageIsUnderFour = 
    <ul className="pagination-list">
      {getPaginationItem(1)}
      {getPaginationItem(2)}
      {getPaginationItem(3)}
      {getPaginationItem(4)}
      <li>
        <span className="pagination-ellipsis">&hellip;</span>
      </li>
      {getPaginationItem(pageCount)}
    </ul>;

  const pageIsFourOrMore = 
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
    </ul>;

  const pageIsWithinFourOfLast = 
    <ul className="pagination-list">
      {getPaginationItem(1)}
      <li>
        <span className="pagination-ellipsis">&hellip;</span>
      </li>
      {getPaginationItem(pageCount - 3)}
      {getPaginationItem(pageCount - 2)}
      {getPaginationItem(pageCount - 1)}
      {getPaginationItem(pageCount)}
    </ul>;

  let paginationItems = pageIsFourOrMore;

  if (pageCount < 6) {
    let listItems: JSX.Element[] = [];
    for (let index = 0; index < pageCount; index++) {
      listItems.push(getPaginationItem(index + 1));
    }
    paginationItems = <ul className="pagination-list">{listItems}</ul>
  } else if (currentPage < 4) {
    paginationItems = pageIsUnderFour;
  } else if (currentPage > pageCount - 3) {
    paginationItems = pageIsWithinFourOfLast;
  }

  return (
    <nav className="pagination is-small is-centered pt-3" role="navigation" aria-label="pagination">
      <a 
        className={classNames('pagination-previous', {'has-opacity-0': currentPage === 1})} 
        aria-hidden={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
      >
        <FaArrowLeft/><span className="ml-1">Previous</span>
      </a>
      <a 
        className={classNames('pagination-next', {'has-opacity-0': currentPage === pageCount})}
        aria-hidden={currentPage === pageCount}
        onClick={() => onChangePage(currentPage + 1)}
      >
        <span className="mr-1">Next</span><FaArrowRight/>
      </a>
      {paginationItems}
    </nav>
  );
};