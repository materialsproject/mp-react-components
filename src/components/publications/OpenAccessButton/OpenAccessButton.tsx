import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Tooltip } from '../../data-display/Tooltip';
import openAccessButtonLogo from './oab_color.png';
import './OpenAccessButton.css';

export interface OpenAccessButtonProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;

  /**
   * Class name(s) to append to the component's default class (mpc-open-access-button)
   * @default 'tag'
   */
  className?: string;

  /**
   * The DOI (Digital Object Identifier) of the publication
   * Will be used to generate a doi.org link and to fetch an open access PDF link.
   */
  doi?: string;

  /**
   * Directly supply the URL to an openly accessible PDF of the reference.
   * If supplied, the component will not try to fetch an open access URL.
   */
  url?: string;

  /**
   * Value to add to the anchor tag's target attribute
   * @default '_blank'
   */
  target?: string;

  /**
   * Only display the publication icon and hide the link label and OAB.
   * Author names will display in a tooltip on hover.
   */
  compact?: boolean;
}

/**
 *
 */
export const OpenAccessButton: React.FC<OpenAccessButtonProps> = ({
  className = 'tag',
  target = '_blank',
  ...otherProps
}) => {
  const props = { className, target, ...otherProps };
  const [openAccessUrl, setOpenAccessUrl] = useState<string | undefined>(props.url);
  const [cannotFetchOpenAccessUrl, setCannotFetchOpenAccessUrl] = useState(() => {
    return !props.doi;
  });

  useEffect(() => {
    if (!openAccessUrl && !cannotFetchOpenAccessUrl) {
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
          setCannotFetchOpenAccessUrl(true);
        });
    }
  }, []);

  return (
    <>
      {openAccessUrl || !cannotFetchOpenAccessUrl ? (
        <a
          id={props.id}
          data-testid="open-access-button"
          target={props.target}
          href={openAccessUrl}
          className={classNames('mpc-open-access-button', props.className)}
          data-tip
          data-for={openAccessUrl}
        >
          {openAccessUrl ? (
            <img src={openAccessButtonLogo} alt="Open Access PDF" />
          ) : (
            <span className="loader"></span>
          )}
          {!props.compact ? (
            <span className="ml-1">Open Access</span>
          ) : (
            <Tooltip id={openAccessUrl}>Open Access</Tooltip>
          )}
        </a>
      ) : null}
    </>
  );
};
