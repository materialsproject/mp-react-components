import React from 'react';
import { BibCard } from '../BibCard';

interface Props {
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
   * Class to add to the top-level element of the component
   * Note: the class "mpc-bibjson-card" is always added to the top-level element by default
   */
  className?: string;

  /**
  * A single bib object in bibjson format.
  * Only the following bib properties are used by this component: title, author (as a list or string), year, doi, journal.
  * If any of those properties are missing, that property will be omitted from the bibjson result card.
  * Any extra properties are simply ignored.
  * e.g.
      {
        "journal": "Physical Review X",
        "year": "2015",
        "issn": "21603308",
        "isbn": "2160-3308",
        "doi": "10.1103/PhysRevX.5.011006",
        "author": ["Agapito, Luis A.", "Curtarolo, Stefano", "Nardelli, Marco Buongiorno"],
        "title": "Reformulation of DFT + U as a Pseudohybrid Hubbard Density Functional for Accelerated Materials Discovery",
        "ENTRYTYPE": "article",
        "ID": "agapito2015"
      }
    */
  bibjsonEntry: any;

  /**
   * Set to true to dynamically fetch a link to a free PDF of
   * the reference (using the bibjsonEntry doi field).
   * NOTE: the open access URL can also be included in the bibjsonEntry
   * in the "openAccessUrl" property. If set, the URL will not be fetched.
   */
  preventOpenAccessFetch?: boolean;
}

export const BibjsonCard: React.FC<Props> = (props) => {
  const getBibjsonAuthorString = (author: string | string[]): string => {
    if (Array.isArray(author)) {
      let authorStr = '';
      author.forEach((a, i) => {
        if (i !== author.length - 1) {
          authorStr += a.split(', ').reverse().join(' ') + ', ';
        } else {
          authorStr += 'and ' + a.split(', ').reverse().join(' ');
        }
      });
      return authorStr;
    } else {
      return author;
    }
  };

  return (
    <BibCard
      id={props.id}
      className={props.className}
      title={props.bibjsonEntry.title}
      author={getBibjsonAuthorString(props.bibjsonEntry.author)}
      year={props.bibjsonEntry.year}
      journal={props.bibjsonEntry.journal}
      doi={props.bibjsonEntry.doi}
      openAccessUrl={props.bibjsonEntry.openAccessUrl}
      preventOpenAccessFetch={props.preventOpenAccessFetch}
    />
  );
};
