import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import './BibCard.css';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  title?: string;
  author?: string;
  year?: string | number;
  journal?: string;
  doi?: string;
}

export const BibCard: React.FC<Props> = (props) => {
  let title: ReactNode;
  if (props.doi) {
    title = <a href={'https://doi.org/' + props.doi}>{props.title}</a>;
  } else {
    title = <span>{props.title}</span>;
  }

  return (
    <div
      id={props.id}
      data-testid="bib-card"
      className={classNames('mpc-bib-card', props.className)}
    >
      <div className="mpc-bib-card-year">{props.year}</div>
      <div>
        <p className="mpc-bib-card-title">{title}</p>
        <p className="mpc-bib-card-authors">{props.author}</p>
        <p className="mpc-bib-card-journal">{props.journal}</p>
      </div>
    </div>
  );
};
