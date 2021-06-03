import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import openAccessButtonLogo from './oab_color.png';
import './OpenAccessButton.css';

export interface OpenAccessButtonProps extends React.HTMLProps<HTMLAnchorElement> {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;

  /**
   * Class name(s) to append to the component's default class (mpc-open-access-button)
   * @default 'button is-small'
   */
  className?: string;

  /**
   * The DOI (Digital Object Identifier) of the reference
   * to attempt to fetch an open access PDF link for.
   */
  doi?: string;

  /**
   * Directly supply the URL to an accessible PDF of the reference.
   * If supplied, the component will not try to fetch an open access URL.
   */
  url?: string;

  /**
   * Set to true to show the text "Loading..." inside the link
   * while the URL is being fetched.
   * If false, the 'is-loading' class is applied to the link while loading.
   * If supplying the Bulma button class, this will show a spinner icon.
   * @default false
   */
  showLoadingText?: boolean;

  /**
   * Value to add to the anchor tag's target attribute
   * @default '_blank'
   */
  target?: string;
}

/**
 * Standardized button for linking to an Open Access PDF.
 * If no url prop is supplied, a PDF link will be fetched
 * from the Open Access Button API using the doi prop.
 */
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
