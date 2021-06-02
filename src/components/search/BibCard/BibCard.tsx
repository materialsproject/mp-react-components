import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { BibtexButton } from '../BibtexButton';
import { OpenAccessButton } from '../OpenAccessButton';
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
  fetchOpenAccessUrl?: boolean;
  openAccessUrl?: string;
}

export const BibCard: React.FC<Props> = (props) => {
  let title: ReactNode;
  let publicationButton: ReactNode;
  if (props.doi) {
    title = (
      <a href={'https://doi.org/' + props.doi} target="_blank">
        {props.title}
      </a>
    );
    publicationButton = (
      <a className="button is-small" href={'https://doi.org/' + props.doi} target="_blank">
        <FaBook />
        &nbsp;Publication
      </a>
    );
  } else {
    title = <span>{props.title}</span>;
  }

  return (
    <div
      id={props.id}
      data-testid="bib-card"
      className={classNames('mpc-bib-card', props.className)}
    >
      <div className="mpc-bib-card-top">
        <p className="mpc-bib-card-title">{title}</p>
        {props.doi && (
          <div className="mpc-bib-card-buttons">
            {publicationButton}
            {(props.fetchOpenAccessUrl || props.openAccessUrl) && (
              <OpenAccessButton doi={props.doi} url={props.openAccessUrl} />
            )}
            <BibtexButton doi={props.doi} />
          </div>
        )}
      </div>
      <p className="mpc-bib-card-authors">{props.author}</p>
      <p>
        <span className="mpc-bib-card-journal">{props.journal}</span>
        {props.journal && <span>, </span>}
        <span className="mpc-bib-card-year">{props.year}</span>
      </p>
    </div>
  );
};
