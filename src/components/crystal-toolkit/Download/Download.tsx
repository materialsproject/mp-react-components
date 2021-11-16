import React, { useEffect } from 'react';
import { toByteArray } from 'base64-js';

/**
 * The Download component opens a download dialog when the data property (dict of filename, content, and type) changes.
 */

interface DataInput {
  filename: string;
  content: any;
  isBase64?: boolean;
  isDataURL?: boolean;
  mimeType?: string;
}

interface Props {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id: string;

  /**
   * When set, a download is invoked using a Blob.
   */
  data?: DataInput;

  /**
   * Set to true if data.content is a base64 string
   */
  isBase64?: boolean;

  /**
   * Set to true if data.content is a data url
   */
  isDataURL?: boolean;

  /**
   * Default value for mimeType.
   */
  mimeType?: string;

  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps?: (value: any) => any;
}

export const Download: React.FC<Props> = ({
  mimeType = 'text/plain',
  isBase64 = false,
  ...otherProps
}) => {
  const props = { mimeType, isBase64, ...otherProps };
  useEffect(() => {
    if (props.data) {
      const mimeType = props.data.mimeType ? props.data.mimeType : props.mimeType;
      const isDataURL = props.data.isDataURL ? props.data.isDataURL : props.isDataURL;
      const isBase64 = props.data.isBase64 ? props.data.isBase64 : props.isBase64;
      let content = props.data.content;
      if (isDataURL) content = toByteArray(props.data.content.split(',')[1]);
      if (isBase64 && !isDataURL) content = toByteArray(props.data.content);
      // Construct the blob.
      const blob = new Blob([content], { type: mimeType });
      const filename = props.data.filename;
      const a = document.createElement('a');
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    }
  }, [props.data]);

  return null;
};
