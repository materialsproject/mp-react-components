import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { PublicationButton } from '../../publications/PublicationButton';
import { BibtexButton } from '../BibtexButton';
import './BibCard.css';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  title?: string;
  author?: string;
  year?: string | number;
  journal?: string;
  shortName?: string;
  doi?: string;
  preventOpenAccessFetch?: boolean;
  openAccessUrl?: string;
}

export const BibCard: React.FC<Props> = (props) => {
  const url = `https://doi.org/${props.doi}`;
  let title: ReactNode;
  if (props.doi) {
    title = (
      <a href={url} target="_blank">
        {props.title}
      </a>
    );
  } else {
    title = <span>{props.title}</span>;
  }

  return (
    <div id={props.id} data-testid="bib-card" className={classNames('mpc-bib-card', props.className)}>
      <p className="mpc-bib-card-title">{title}</p>
      <p className="mpc-bib-card-authors">{props.author}</p>
      <p>
        <span className="mpc-bib-card-journal">{props.journal}</span>
        {props.journal && <span>, </span>}
        <span className="mpc-bib-card-year">{props.year}</span>
      </p>
      {props.doi && (
        <div className="mpc-bib-card-buttons tags">
          <PublicationButton
            doi={props.doi}
            url={url}
            openAccessUrl={props.openAccessUrl}
            preventOpenAccessFetch={props.preventOpenAccessFetch}
          >
            {props.shortName}
          </PublicationButton>
          <BibtexButton doi={props.doi} />
        </div>
      )}
    </div>
  );
};
