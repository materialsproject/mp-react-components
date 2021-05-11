import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { downloadAs, DownloadType } from '../utils';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import { FaAngleDown } from 'react-icons/fa';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  buttonClassName?: string;
  data: any;
  filename?: string;
  tooltip?: string;
}

export const DownloadDropdown: React.FC<Props> = ({ filename = 'export', ...otherProps }) => {
  const props = { filename, ...otherProps };
  const [downloadType, setDownloadType] = useState<null | DownloadType>(null);

  const handleDownloadTypeChange = (type: DownloadType) => {
    setDownloadType(type);
  };

  /**
   * Trigger download when download type changes
   * Running the download method inside an effect ensures
   * that props.data contains the latest data.
   * Setting downloadType to null after executon ensures
   * that the effect will be triggered on every selection.
   */
  useEffect(() => {
    if (downloadType) {
      downloadAs[downloadType](props.data, props.filename);
      setDownloadType(null);
    }
  }, [downloadType]);

  return (
    <MenuWrapper
      data-testid="mpc-download-dropdown"
      className={classNames('mpc-download-dropdown dropdown is-active', props.className)}
      onSelection={handleDownloadTypeChange}
    >
      <div className="dropdown-trigger">
        <Button
          className={classNames('button', props.buttonClassName)}
          data-tooltip={props.tooltip}
        >
          <span>{props.children}</span>
          <span className="icon">
            <FaAngleDown />
          </span>
        </Button>
      </div>
      <Menu className="dropdown-menu">
        <ul className="dropdown-content">
          <MenuItem value="json">
            <li className="dropdown-item">JSON</li>
          </MenuItem>
          <MenuItem value="csv">
            <li className="dropdown-item">CSV</li>
          </MenuItem>
          <MenuItem value="xlsx">
            <li className="dropdown-item">Excel</li>
          </MenuItem>
        </ul>
      </Menu>
    </MenuWrapper>
  );
};
