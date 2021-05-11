import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { downloadAs, DownloadType } from '../utils';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  data: any;
  filename?: string;
  filetype?: DownloadType;
  tooltip?: string;
}

export const DownloadButton: React.FC<Props> = ({
  filename = 'export',
  filetype = 'json',
  ...otherProps
}) => {
  const props = { filename, filetype, ...otherProps };
  return (
    <button
      className={classNames('mpc-download-button', props.className)}
      onClick={() => downloadAs[props.filetype](props.data, props.filename)}
      data-tooltip={props.tooltip}
    >
      {props.children}
    </button>
  );
};
