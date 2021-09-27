import React from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import { BibCard } from '.';

afterEach(() => cleanup());

describe('<BibCard/>', () => {
  it('should render bibliographic information', () => {
    render(<BibCard {...defaultProps} />);
    expect(screen.getByText('Publication Title')).toBeInTheDocument();
    expect(screen.getByText('Peter Parker, Ben Parker')).toBeInTheDocument();
    expect(screen.getByText('Journal Title')).toBeInTheDocument();
    expect(screen.getByText('2001')).toBeInTheDocument();
  });
  it('should render publication button', () => {
    render(<BibCard {...defaultProps} />);
    expect(screen.getByTestId('publication-button')).toBeInTheDocument();
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
