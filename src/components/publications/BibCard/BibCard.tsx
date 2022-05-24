import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import {
  CrossrefAuthor,
  getAuthorString,
  getJournalAndYear,
  shortenAuthorString
} from '../../../utils/publications';
import { PublicationButton } from '../../publications/PublicationButton';
import { BibtexButton } from '../BibtexButton';
import { OpenAccessButton } from '../OpenAccessButton';
import './BibCard.css';

export interface BibCardProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
  /**
   * Class name(s) to append to the component's default class (`mpc-bib-card`)
   */
  className?: string;
  /**
   * Title of the publication
   */
  title?: string;
  /**
   * List of author names for the publication. Can be either a list of plain strings or a list of `CrossrefAuthor` objects.
   * The latter is an object with `given` (name), `family` (last name), and `sequence` ("first" or "additional").
   */
  author?: string[] | CrossrefAuthor[];
  /**
   * Shortened title of the article
   */
  shortName?: string;
  /**
   * Year the article was published
   */
  year?: string | number;
  /**
   * Journal that the article was published in
   */
  journal?: string;
  /**
   * Digital Object Identifier (DOI) for the article. This is used to generate the link to the article.
   * It is also used to fetch an open access link.
   */
  doi?: string;
  /**
   * Set to true to prevent the card from trying to get an open access URL from the Open Access API.
   */
  preventOpenAccessFetch?: boolean;
  /**
   * URL to an openly available version of the article (can also be fetched dynamically if a DOI is supplied).
   */
  openAccessUrl?: string;
}

/**
 * Card for displaying bibliographic information.
 * This component is the basis for the `BibjsonCard` and `CrossrefCard` components.
 */
export const BibCard: React.FC<BibCardProps> = ({ title = '', ...otherProps }) => {
  const props = { title, ...otherProps };
  const url = `https://doi.org/${props.doi}`;
  let titleElement: ReactNode;
  if (props.doi) {
    titleElement = (
      <a href={url} target="_blank" dangerouslySetInnerHTML={{ __html: props.title }}></a>
    );
  } else {
    titleElement = <span dangerouslySetInnerHTML={{ __html: props.title }}></span>;
  }

  return (
    <div
      id={props.id}
      data-testid="bib-card"
      className={classNames('mpc-bib-card', props.className)}
    >
      <p data-testid="bib-card-title" className="mpc-bib-card-title">
        {titleElement}
      </p>
      <p data-testid="bib-card-authors" className="mpc-bib-card-authors">
        {getAuthorString(props.author)}
      </p>
      {props.doi && (
        <div className="mpc-bib-card-buttons tags">
          <PublicationButton doi={props.doi} url={url}>
            {getJournalAndYear(props.journal, props.year)}
          </PublicationButton>
          <OpenAccessButton doi={props.doi} url={props.openAccessUrl} />
          <BibtexButton doi={props.doi} />
        </div>
      )}
    </div>
  );
};
