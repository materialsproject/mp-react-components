import React from 'react';
import { linkOnClick } from '../../../utils/utils';

interface Props {
  className?: string;
  href?: string;
  onClick?: () => void;
  target?: string;
}

export const Link: React.FC<Props> = (props) => {
  return (
    <a
      className={props.className}
      href={props.href}
      target={props.target}
      onClick={(e) => {
        if (props.onClick) props.onClick();
        linkOnClick(e, props.href);
      }}
    >
      {props.children}
    </a>
  );
};
