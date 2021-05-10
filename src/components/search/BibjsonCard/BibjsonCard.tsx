import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import './BibjsonCard.css';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  bibjsonEntry: any;
}

export const BibjsonCard: React.FC<Props> = (props) => {
  let title: ReactNode;
  if (props.bibjsonEntry.doi) {
    title = <a href={'https://doi.org/' + props.bibjsonEntry.doi}>{props.bibjsonEntry.title}</a>;
  } else {
    title = <span>{props.bibjsonEntry.title}</span>;
  }

  let authors: ReactNode;
  if (Array.isArray(props.bibjsonEntry.author)) {
    let authorStr = '';
    props.bibjsonEntry.author.forEach((a, i) => {
      if (i !== props.bibjsonEntry.author.length - 1) {
        authorStr += a.split(', ').reverse().join(' ') + ', ';
      } else {
        authorStr += 'and ' + a.split(', ').reverse().join(' ');
      }
    });
    authors = <span>{authorStr}</span>;
  } else {
    authors = <span>{props.bibjsonEntry.author}</span>;
  }

  return (
    <div data-testid="bibjson-card" className={classNames('mpc-bibjson-card', props.className)}>
      <div className="mpc-bibjson-card-year">{props.bibjsonEntry.year}</div>
      <div>
        <p className="mpc-bibjson-card-title">{title}</p>
        <p className="mpc-bibjson-card-authors">{authors}</p>
        <p className="mpc-bibjson-card-journal">{props.bibjsonEntry.journal}</p>
      </div>
    </div>
  );
};
