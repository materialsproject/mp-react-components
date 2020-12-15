import React from "react";
import { linkOnClick } from "../../../utils/utils";

export const Link = ({ className='', href, children }) => {
  return (
    <a className={className} href={href} onClick={(e) => linkOnClick(e, href)}>
      {children}
    </a>
  );
};