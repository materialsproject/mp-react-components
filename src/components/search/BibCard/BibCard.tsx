import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { OpenAccessButton } from '../OpenAccessButton';
import { OpenAccessLink } from '../OpenAccessLink';
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
      <div className="mpc-bib-card-top">
        <p className="mpc-bib-card-title">{title}</p>
        {props.doi && (
          <div className="mpc-bib-card-buttons">
            {(props.fetchOpenAccessUrl || props.openAccessUrl) && (
              <OpenAccessButton doi={props.doi} url={props.openAccessUrl} />
            )}
            {/* <button className="button is-small">Bibtex</button> */}
          </div>
        )}
      </div>
      <p className="mpc-bib-card-authors">{props.author}</p>
      <p>
        <span className="mpc-bib-card-journal">{props.journal}</span>
        <span>, </span>
        <span className="mpc-bib-card-year">{props.year}</span>
      </p>
    </div>
  );
};
