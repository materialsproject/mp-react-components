import React from 'react';
import { linkOnClick } from '../../../utils/navigation';

interface Props {
  className?: string;
  href?: string;
  onClick?: (e) => void;
  target?: string;
  /**
   * If true, the current query parameters will not be removed from the url
   * when following the link.
   */
  preserveQuery?: boolean;
}

/**
 * Custom Link component that can handle both internal and external URLs.
 * You can also use this component if you need to preserve the url query parameters
 * when following a link.
 */
export const Link: React.FC<Props> = (props) => {
  const isExternal = props.href?.indexOf('http://') == 0 || props.href?.indexOf('https://') == 0;
  const url = props.preserveQuery ? props.href + window.location.search : props.href;
  return (
    <a
      className={props.className}
      href={url}
      target={props.target}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        if (!isExternal) linkOnClick(e, url);
      }}
    >
      {props.children}
    </a>
  );
};
