import { findByRole, render, screen } from '@testing-library/react';

import { UserReservations } from '@/components/user/UserReservations';

test("Displays reservations and 'Purchase more' button when reservations exist ", async () => {
  render(<UserReservations userId={1} />);

  const heading = await screen.findByRole('heading', {
    name: /Your Tickets/i,
  });
  const bandName = await screen.findByRole('heading', {
    name: /The Joyous Nun Riot/i,
  });
  const purchaseButton = await screen.findByRole('button', {
    name: /Purchase more tickets/i,
  });

  expect(heading).toBeInTheDocument();
  expect(bandName).toBeInTheDocument();
  expect(purchaseButton).toBeInTheDocument();
});

test("Displays 'Purchase tickets' button, when there are NO reservations", async () => {
  render(<UserReservations userId={0} />);

  const heading = screen.queryByRole('heading', {
    name: /Your Tickets/i,
  });
  expect(heading).not.toBeInTheDocument();

  const purchaseButton = await screen.findByRole('button', {
    name: /Purchase tickets/i,
  });
  expect(purchaseButton).toBeInTheDocument();
});
