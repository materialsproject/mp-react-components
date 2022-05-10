import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { Tooltip } from '../../data-display/Tooltip';
import { v4 as uuidv4 } from 'uuid';
import './PublicationButton.css';
import { getJournalAndYear } from '../../../utils/publications';

export interface PublicationButtonProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;
  /**
   * Class name(s) to append to the component's default class (mpc-publication-button)
   * @default 'tag'
   */
  className?: string;
  /**
   * The DOI (Digital Object Identifier) of the publication
   * Will be used to generate a doi.org link and to fetch the journal name and year.
   */
  doi?: string;
  /**
   * Directly supply the URL to the publication.
   * If a doi.org url is supplied, this component will automatically
   * parse the url for the doi and use that to fetch the journal name and year.
   */
  url?: string;
  /**
   * Value to add to the anchor tag's target attribute
   * @default '_blank'
   */
  target?: string;
  /**
   * Only display the publication icon and hide the link label.
   * If true, `showTooltip` will default to true.
   */
  compact?: boolean;
  /**
   * Show a tooltip on hover with the bibliographic citation for the publication.
   */
  showTooltip?: boolean;
}

/**
 * Standardized button for linking to a publication.
 *
 * This component can be used in four ways:
 * 1. Supply just a `doi` and let the component build the url and fetch the journal name and year from crossref.
 * 2. Supply just a `url` to doi.org and fetch the journal name and year from crossref.
 * 3. Supply a `doi` and a link label in the component's `children`. In this case, there will be no fetch to crossref.
 * 4. Supply a `url` to any location and a link label in the component's `children`. In this case, there will be no fetch to crossref.
 */
export const PublicationButton: React.FC<PublicationButtonProps> = ({
  className = 'tag',
  target = '_blank',
  ...otherProps
}) => {
  const props = { className, target, ...otherProps };
  const [linkLabel, setLinkLabel] = useState<any>(props.children);
  const [showTooltip, setShowTooltip] = useState<any>(props.showTooltip || props.compact);
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
  const [cannotFetch, setCannotFetch] = useState(() => {
    return !doi;
  });
  const [tooltip, setTooltip] = useState<string | undefined>();

  useEffect(() => {
    if (!linkLabel && !cannotFetch) {
      axios
        .get(`https://api.crossref.org/works/${doi}`)
        .then((result) => {
          if (!linkLabel && result.data.hasOwnProperty('message')) {
            let journal: string | undefined, year: string | undefined;
            if (result.data.message.hasOwnProperty('container-title')) {
              journal = result.data.message['container-title'].join(', ');
            }
            if (result.data.message.hasOwnProperty('created')) {
              year = result.data.message.created['date-parts'][0][0];
            }
            setLinkLabel(getJournalAndYear(journal, year));
          }

          if (
            !url &&
            result.data.hasOwnProperty('message') &&
            result.data.message.hasOwnProperty('URL')
          ) {
            setUrl(result.data.message.URL);
          }
        })
        .catch((error) => {
          console.log(error);
          setCannotFetch(true);
        });
    }
    if (showTooltip && !cannotFetch) {
      axios
        .get(`https://api.crossref.org/works/${doi}/transform/text/x-bibliography`)
        .then((result) => {
          let tooltipText = result.data;
          let urlIndex = tooltipText.indexOf('. http');
          if (urlIndex > -1) {
            tooltipText = tooltipText.slice(0, urlIndex + 1);
          }
          setTooltip(tooltipText);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <a
      data-testid="publication-button"
      id={props.id}
      className={classNames('mpc-publication-button', props.className)}
      href={url}
      target={props.target}
      data-tip
      data-for={url}
    >
      <FaBook />
      {!props.compact && <span className="ml-1">{linkLabel || 'Publication'}</span>}
      {tooltip && (
        <Tooltip id={url}>
          <span dangerouslySetInnerHTML={{ __html: tooltip }}></span>
        </Tooltip>
      )}
    </a>
  );
};
