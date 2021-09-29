import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import mpPapers from '../../../mocks/constants/mp-papers.json';
import { BibFilter } from '.';

describe('<BibFilter/>', () => {
  it('should render sortable and searchable bib cards', async () => {
    render(<BibFilter {...defaultProps} />);
    expect(screen.getAllByTestId('bib-card').length).toBeGreaterThanOrEqual(100);

    const cards = await screen.findAllByTestId('bib-card-year');
    expect(cards[0]).toHaveTextContent('2017');
    expect(cards[cards.length - 1]).toHaveTextContent('2008');

    fireEvent.click(screen.getByTestId('sort-button'));
    await waitFor(() => {
      expect(cards[0]).toHaveTextContent('2008');
      expect(cards[cards.length - 1]).toHaveTextContent('2017');
    });

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Patrick' } });
    await waitFor(() => {
      expect(screen.getAllByTestId('bib-card')).toHaveLength(1);
      expect(screen.getByTestId('bib-card-authors')).toHaveTextContent(/Patrick/);
    });

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    await waitFor(() => {
      expect(screen.getAllByTestId('bib-card').length).toBeGreaterThanOrEqual(100);
    });
  });
});

const defaultProps = {
  bibEntries: mpPapers,
  preventOpenAccessFetch: true
};
