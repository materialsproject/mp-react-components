import React from 'react';
import { BibCard } from '../BibCard';

export interface BibjsonCardProps {
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
   * Class name(s) to append to the component's default class
   */
  className?: string;

  /**
   * A single bib object in bibjson format.
   * Only the following bib properties are used by this component: title, author (as a list or string), year, doi, journal.
   * If any of those properties are missing, that property will be omitted from the bibjson result card.
   * Any extra properties are simply ignored.
   */
  bibjsonEntry: any;

  /**
   * Set to true to prevent dynamically fetching a link to a free PDF of
   * the reference (using the doi field).
   * NOTE: the open access URL can also be included in the bibjsonEntry
   * in the `openAccessUrl` property. If set, the URL will not be fetched.
   */
  preventOpenAccessFetch?: boolean;
}

/**
 * Parses a bibjson object and renders a `BibCard`.
 */
export const BibjsonCard: React.FC<BibjsonCardProps> = (props) => {
  return (
    <BibCard
      id={props.id}
      className={props.className}
      title={props.bibjsonEntry.title}
      author={props.bibjsonEntry.author}
      year={props.bibjsonEntry.year}
      journal={props.bibjsonEntry.journal}
      doi={props.bibjsonEntry.doi}
      openAccessUrl={props.bibjsonEntry.openAccessUrl}
      preventOpenAccessFetch={props.preventOpenAccessFetch}
    />
  );
};
