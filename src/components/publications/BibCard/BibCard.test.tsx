import React from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import { BibCard } from '.';

afterEach(() => cleanup());

describe('<BibCard/>', () => {
  it('should render bibliographic information', async () => {
    render(<BibCard {...defaultProps} />);
    expect(screen.getByText('Publication Title')).toBeInTheDocument();
    expect(screen.getByText('Peter Parker and Ben Parker')).toBeInTheDocument();
    await waitFor(() => {
      const publicationButton = screen.getByTestId('publication-button');
      expect(publicationButton).toHaveTextContent('Journal Title');
      expect(publicationButton).toHaveTextContent('2001');
    });
  });
  it('should render bibtex button', () => {
    render(<BibCard {...defaultProps} />);
    expect(screen.getByText('BibTeX')).toBeInTheDocument();
  });
});

const defaultProps = {
  className: 'box',
  title: 'Publication Title',
  author: ['Peter Parker', 'Ben Parker'],
  year: '2001',
  journal: 'Journal Title',
  doi: '10.1557/mrc.2016.29',
  preventOpenAccessFetch: false
};
