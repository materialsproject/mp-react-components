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
   * @default 'tag'
   */
  className?: string;

  /**
   * The DOI (Digital Object Identifier) of the publication
   * Will be used to generate a doi.org link and to fetch an open access PDF link.
   */
  doi?: string;

  /**
   * Directly supply the URL to the publication.
   * If a doi.org url is supplied, this component will automatically
   * parse the url for the doi and use that to fetch an open access link.
   */
  url?: string;

  /**
   * Directly supply the URL to an openly accessible PDF of the reference.
   * If supplied, the component will not try to fetch an open access URL.
   */
  openAccessUrl?: string;

  /**
   * Set to true to prevent any requests to the open access api.
   * Note that if you supply your own openAccessUrl, this prop is not necessary.
   */
  preventOpenAccessFetch?: boolean;

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
export const PublicationButton: React.FC<Props> = ({
  className = 'tag',
  target = '_blank',
  ...otherProps
}) => {
  const props = { className, target, ...otherProps };
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
  const [cannotFetchOpenAccessUrl, setCannotFetchOpenAccessUrl] = useState(() => {
    return props.preventOpenAccessFetch || !doi;
  });
  const tooltipId = uuidv4();

  useEffect(() => {
    if (!openAccessUrl && !cannotFetchOpenAccessUrl) {
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
          setCannotFetchOpenAccessUrl(true);
        });
    }
  }, []);

  return (
    <span className={classNames('mpc-publication-button', props.className)}>
      <span className="tags has-addons">
        <a className="tag" href={url} target="_blank">
          <FaBook />
          &nbsp;{linkLabel || 'Publication'}
        </a>
        {openAccessUrl || !cannotFetchOpenAccessUrl ? (
          <a
            id={props.id}
            target={props.target}
            href={openAccessUrl}
            className="tag mpc-open-access-button"
            data-tip
            data-for={tooltipId}
          >
            {openAccessUrl ? (
              <img src={openAccessButtonLogo} alt="Open Access PDF" />
            ) : (
              <span className="loader"></span>
            )}
            <Tooltip id={tooltipId}>Open Access PDF</Tooltip>
          </a>
        ) : null}
      </span>
    </span>
  );
};
