import React from 'react';
import { BibCard } from '../BibCard';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  bibjsonEntry: any;
  fetchOpenAccessUrl?: boolean;
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
      fetchOpenAccessUrl={props.fetchOpenAccessUrl}
    />
  );
};
