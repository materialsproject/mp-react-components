import classNames from 'classnames';
import React, { ReactNode } from 'react';
import './DataCard.css';

interface KeyLabelPair {
  key: string;
  label: string;
}

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  title: string;
  authors?: string;
  references?: any[];
  description?: string;
  dataLegend?: object;
  hasData?: boolean;
  hasTables?: boolean;
  hasStructures?: boolean;
  hasAttachments?: boolean;
}

export const MPContribsCard: React.FC<Props> = (props) => {
  return (
    <div
      id={props.id}
      data-testid="mpc-mpcontribs-card"
      className={classNames('mpc-mpcontribs-card', props.className)}
    >
      <p className="mpc-mpcontribs-card-title">{props.title}</p>
      <p className="mpc-mpcontribs-card-authors">{props.authors}</p>
      <p>
        <span className="mpc-bib-card-journal">{props.journal}</span>
        {props.journal && <span>, </span>}
        <span className="mpc-bib-card-year">{props.year}</span>
      </p>
    </div>
  );
};
