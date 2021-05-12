import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
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
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  return (
    <button
      className={classNames('mpc-download-button', props.className)}
      onClick={() => downloadAs[props.filetype](data, props.filename)}
      data-tooltip={props.tooltip}
    >
      {props.children}
    </button>
  );
};
