import { render, screen } from '@testing-library/react';

import { readFakeData } from '@/__tests__/__mocks__/fakeData';
import BandComponent from '@/pages/bands/[bandId]';

test('band component displays correct band information', async () => {
  const { fakeBands } = await readFakeData();
  render(<BandComponent error={null} band={fakeBands[0]} />);

  const heading = screen.getByRole('heading', {
    name: /The Wandering Bunnies/i,
  });
  expect(heading).toBeInTheDocument();

  // should be test img, description
});

test('band component display error message, when it occurs', () => {
  render(<BandComponent band={null} error="band not found" />);

  const error = screen.getByRole('heading', {
    name: /Could not retrieve band data: band not found/i,
  });
  expect(error).toBeInTheDocument();
});
