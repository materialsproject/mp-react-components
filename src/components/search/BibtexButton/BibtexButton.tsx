import classNames from 'classnames';
import React, { useState } from 'react';
import { BibCard } from '../BibCard';

interface Props extends React.HTMLProps<HTMLAnchorElement> {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;

  /**
   * Class name(s) to append to the component's default class (mpc-open-access-button)
   * @default 'button is-small'
   */
  className?: string;

  /**
   * The DOI (Digital Object Identifier) of the reference
   * to pass to doi2bib.org.
   */
  doi?: string;

  /**
   * Directly supply the URL to a reference's bibtex.
   * If supplied, the component will not generate its own link using the doi prop.
   */
  url?: string;

  /**
   * Value to add to the anchor tag's target attribute
   * @default '_blank'
   */
  target?: string;
}

/**
 * Standardized button for linking to BibTeX.
 * If no url prop is supplied, a link will be generated
 * using the doi prop and doi2bib.org.
 */
export const BibtexButton: React.FC<Props> = ({ className = 'tag', target = '_blank', ...otherProps }) => {
  const props = { className, target, ...otherProps };
  const [bibtexUrl, setBibtexUrl] = useState<string>(() => {
    return props.url || `https://www.doi2bib.org/bib/${props.doi}`;
  });
  return (
    <a className={classNames('mpc-bibtex-button', props.className)} href={bibtexUrl} target={props.target}>
      BibTeX
    </a>
  );
};
