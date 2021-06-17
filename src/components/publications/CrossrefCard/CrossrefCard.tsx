import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
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
   * Class name(s) to append to the component's default class
   */
  className?: string;

  /**
   * A single bib object in crossref format.
   * If a crossEntry is supplied, a request will not be made to the crossref API.
   * The following bib values are parsed from a Crossref API response: title, authors, year, doi, journal.
   */
  crossrefEntry?: any;

  /**
   * Either a DOI or bibtex string to use to search against the Crossref /works endpoint.
   * An identifier must be supplied if you are not supplying the crossrefEntry directly.
   */
  identifier?: string;

  /**
   * Error message to show inside the card if the crossref request fails
   * @default 'Could not find reference'
   */
  errorMessage?: string;

  /**
   * Set to true to prevent dynamically fetching a link to a free PDF of
   * the reference (using the doi field).
   * NOTE: the open access URL can also be included in the crossrefEntry json
   * in the "openAccessUrl" property. If set, the URL will not be fetched.
   */
  preventOpenAccessFetch?: boolean;
}

interface CrossrefAuthor {
  given: string;
  family: string;
  sequence?: 'first' | 'additional';
  [id: string]: any;
}

/**
 * Parses a crossref entry or fetches a reference from the crossref API and renders a BibCard.
 */
export const CrossrefCard: React.FC<Props> = (props) => {
  props = {
    errorMessage: 'Could not find reference',
    ...props
  };
  const [crossref, setCrossref] = useState(props.crossrefEntry);
  const [failedRequest, setFailedRequest] = useState(false);

  const getCrossrefAuthorString = (authors: CrossrefAuthor[]): string => {
    let authorStr = '';
    authors.forEach((a, i) => {
      if (i !== authors.length - 1) {
        authorStr += `${a.given} ${a.family}, `;
      } else {
        authorStr += `and ${a.given} ${a.family}`;
      }
    });
    return authorStr;
  };

  useEffect(() => {
    if (!crossref && props.identifier) {
      axios
        .get(`https://api.crossref.org/works/${props.identifier}`)
        .then((result) => {
          if (result.data.hasOwnProperty('message')) {
            setCrossref(result.data.message);
          }
        })
        .catch((error) => {
          setFailedRequest(true);
        });
    }
  }, []);

  useEffect(() => {
    setCrossref(props.crossrefEntry);
  }, [props.crossrefEntry]);

  return (
    <>
      {crossref ? (
        <BibCard
          id={props.id}
          className={props.className}
          title={crossref && crossref.title.join(' ')}
          author={crossref && getCrossrefAuthorString(crossref.author)}
          year={crossref && crossref.created['date-parts'][0][0]}
          journal={crossref && crossref.publisher}
          shortName={crossref && crossref['short-container-title'][0]}
          doi={crossref && crossref.DOI}
          preventOpenAccessFetch={props.preventOpenAccessFetch}
          openAccessUrl={crossref && crossref.openAccessUrl}
        />
      ) : (
        <div id={props.id} className={props.className}>
          {failedRequest ? props.errorMessage : 'Loading...'}
        </div>
      )}
    </>
  );
};
