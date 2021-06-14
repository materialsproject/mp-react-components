import React from 'react';
import { linkOnClick } from '../../../utils/utils';

interface Props {
  className?: string;
  href?: string;
  onClick?: (e) => void;
  target?: string;
}

export const Link: React.FC<Props> = (props) => {
  const isExternal = props.href?.indexOf('http://') == 0 || props.href?.indexOf('https://') == 0;
  return (
    <a
      className={props.className}
      href={props.href}
      target={props.target}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        if (!isExternal) linkOnClick(e, props.href);
      }}
    >
      {props.children}
    </a>
  );
};
