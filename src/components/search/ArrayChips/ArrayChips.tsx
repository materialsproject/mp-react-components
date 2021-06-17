import classNames from 'classnames';
import React, { ReactNode, useRef, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { PublicationButton } from '../../publications/PublicationButton';
import { Tooltip } from '../Tooltip';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  chips: string[] | number[];
  chipTooltips?: string[];
  chipLinks?: string[];
  chipType?: 'normal' | 'publication';
  showDownloadIcon?: boolean;
}

export const ArrayChips: React.FC<Props> = ({ chipType = 'normal', ...otherProps }) => {
  const props = { chipType, ...otherProps };
  return (
    <span className="tags">
      {props.chips.map((item, i) => {
        const tooltipId = uuidv4();
        const tooltip = props.chipTooltips && props.chipTooltips[i] && (
          <Tooltip id={tooltipId}>{props.chipTooltips[i]}</Tooltip>
        );
        if (props.chipLinks && props.chipLinks[i] && props.chipType === 'normal') {
          return (
            <a
              key={`array-chip-${i}-${item}`}
              className="tag"
              href={props.chipLinks[i]}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              data-tip
              data-for={tooltipId}
            >
              {props.showDownloadIcon && <FaDownload className="mr-1" />}
              {item}
              {tooltip}
            </a>
          );
        } else if (props.chipLinks && props.chipLinks[i] && props.chipType === 'publication') {
          return (
            <PublicationButton
              key={`array-chip-${i}-${item}`}
              className="tag"
              url={props.chipLinks[i]}
            >
              {item}
              {tooltip}
            </PublicationButton>
          );
        } else {
          return (
            <span key={`array-chip-${i}-${item}`} className="tag" data-tip data-for={tooltipId}>
              {item}
              {tooltip}
            </span>
          );
        }
      })}
    </span>
  );
};
