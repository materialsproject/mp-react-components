import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

export interface OpenAccessLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  id?: string;
  className?: string;
  doi?: string;
  url?: string;
  showLoadingText?: boolean;
}

export const OpenAccessLink: React.FC<OpenAccessLinkProps> = (props) => {
  const [openAccessUrl, setOpenAccessUrl] = useState<string | undefined>(props.url);
  const [failedRequest, setFailedRequest] = useState(false);

  useEffect(() => {
    if (!openAccessUrl && props.doi) {
      axios
        .get(`https://api.openaccessbutton.org/find?id=${props.doi}`)
        .then((result) => {
          if (result.data.hasOwnProperty('url')) {
            setOpenAccessUrl(result.data.url);
          } else {
            throw new Error('No Open Access URL found');
          }
        })
        .catch((error) => {
          console.log(error);
          setFailedRequest(true);
        });
    }
  }, []);

  return (
    <>
      {!failedRequest ? (
        <a
          {...props}
          href={openAccessUrl}
          className={classNames(props.className, {
            'is-loading': !openAccessUrl && !props.showLoadingText,
          })}
        >
          {openAccessUrl || !props.showLoadingText ? props.children : 'Loading...'}
        </a>
      ) : null}
    </>
  );
};
