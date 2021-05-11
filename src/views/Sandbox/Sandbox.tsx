import React from 'react';
import { DownloadButton } from '../../components/search/DownloadButton';
import { DownloadDropdown } from '../../components/search/DownloadDropdown';

/**
 * View for testing out small new components
 */

export const Sandbox: React.FC = () => {
  return (
    <>
      <h1 className="title">Sandbox</h1>
      <DownloadButton className="button" data={[{ test: 1 }]} filename="test">
        Download
      </DownloadButton>
      <DownloadDropdown data={[{ test: 1 }]} filename="test">
        Download as
      </DownloadDropdown>
    </>
  );
};
