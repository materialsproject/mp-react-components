import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { Tooltip } from '../../search/Tooltip';
import openAccessButtonLogo from './oab_color.png';
import { v4 as uuidv4 } from 'uuid';
import './PublicationButton.css';

interface Props {
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
   * Directly supply the URL to an accessible PDF of the reference.
   * If supplied, the component will not try to fetch an open access URL.
   */
  openAccessUrl?: string;

  preventOpenAccessFetch?: boolean;

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
export const PublicationButton: React.FC<Props> = ({ target = '_blank', ...otherProps }) => {
  const props = { target, ...otherProps };
  const [linkLabel, setLinkLabel] = useState<any>(props.children);
  const [openAccessUrl, setOpenAccessUrl] = useState<string | undefined>(props.openAccessUrl);
  const [doi, setDoi] = useState<string | undefined>(() => {
    if (props.doi) {
      return props.doi;
    } else if (props.url && props.url.indexOf('https://doi.org/') === 0) {
      return props.url.split('https://doi.org/')[1];
    } else {
      return;
    }
  });
  const [url, setUrl] = useState<string | undefined>(() => {
    if (props.url) {
      return props.url;
    } else if (props.doi) {
      return `https://doi.org/${props.doi}`;
    } else {
      return;
    }
  });
  const [failedRequest, setFailedRequest] = useState(false);
  const tooltipId = uuidv4();

  useEffect(() => {
    if (!openAccessUrl && doi && !props.preventOpenAccessFetch) {
      axios
        .get(`https://api.openaccessbutton.org/find?id=${doi}`)
        .then((result) => {
          if (
            !linkLabel &&
            result.data.hasOwnProperty('metadata') &&
            result.data.metadata.hasOwnProperty('shortname')
          ) {
            setLinkLabel(result.data.metadata.shortname);
          }
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
    <span className="mpc-publication-button tag tags has-addons">
      <a className="tag" href={url} target="_blank">
        <FaBook />
        &nbsp;{linkLabel || 'Publication'}
      </a>
      {!failedRequest && !props.preventOpenAccessFetch ? (
        <a
          id={props.id}
          target={props.target}
          href={openAccessUrl}
          className={classNames('tag mpc-open-access-button', {
            'is-loading': !openAccessUrl && !props.showLoadingText
          })}
          data-tip
          data-for={tooltipId}
        >
          {openAccessUrl || !props.showLoadingText ? (
            <img src={openAccessButtonLogo} alt="Open Access PDF" />
          ) : (
            'Loading...'
          )}
          <Tooltip id={tooltipId}>Open Access PDF</Tooltip>
        </a>
      ) : null}
    </span>
  );
};
