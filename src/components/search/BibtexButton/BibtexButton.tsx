import React from 'react';
import { BibCard } from '../BibCard';

interface Props extends React.HTMLProps<HTMLAnchorElement> {
  id?: string;
  className?: string;
  doi: string;
}

export const BibtexButton: React.FC<Props> = (props) => {
  props = {
    className: 'button is-small',
    children: 'BibTeX',
    href: `https://www.doi2bib.org/bib/${props.doi}`,
    target: '_blank',
    ...props,
  };

  return <a {...props} />;
};
