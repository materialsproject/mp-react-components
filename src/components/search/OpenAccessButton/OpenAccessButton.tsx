import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import openAccessButtonLogo from './oab_color.png';
import './OpenAccessButton.css';

export interface OpenAccessButtonProps extends React.HTMLProps<HTMLAnchorElement> {
  id?: string;
  className?: string;
  doi?: string;
  url?: string;
  showLoadingText?: boolean;
  target?: string;
}

export const OpenAccessButton: React.FC<OpenAccessButtonProps> = ({
  className = 'button is-small',
  target = '_blank',
  ...otherProps
}) => {
  const props = { className, target, ...otherProps };
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
          id={props.id}
          target={props.target}
          href={openAccessUrl}
          className={classNames('mpc-open-access-button', props.className, {
            'is-loading': !openAccessUrl && !props.showLoadingText,
          })}
        >
          {openAccessUrl || !props.showLoadingText ? (
            <span>
              <img src={openAccessButtonLogo} alt="Open Access PDF" /> <span>Open Access</span>
            </span>
          ) : (
            'Loading...'
          )}
        </a>
      ) : null}
    </>
  );
};
