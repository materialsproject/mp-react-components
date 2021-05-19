import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { BibCard } from '../BibCard';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  crossrefEntry?: any;
  doi?: string;
  errorMessage?: string;
  fetchOpenAccessUrl?: boolean;
}

interface CrossrefAuthor {
  given: string;
  family: string;
  sequence?: 'first' | 'additional';
  [id: string]: any;
}

export const CrossrefCard: React.FC<Props> = (props) => {
  props = {
    errorMessage: 'Could not find reference',
    ...props,
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
    if (!crossref && props.doi) {
      axios
        .get(`https://api.crossref.org/works/${props.doi}`)
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
          doi={crossref && crossref.DOI}
          fetchOpenAccessUrl={props.fetchOpenAccessUrl}
        />
      ) : (
        <div id={props.id} className={props.className}>
          {failedRequest ? props.errorMessage : 'Loading...'}
        </div>
      )}
    </>
  );
};
