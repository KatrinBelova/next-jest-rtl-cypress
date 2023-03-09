import { render, screen } from '@testing-library/react';

import { Reservation } from '@/components/reservations/Reservation';

test('reservation page shows correct number of seats', async () => {
  // doesn't metter what id is, because msw returns mock data anyway
  render(<Reservation showId={0} submitPurchase={jest.fn()} />);

  const seatCountText = await screen.findByText(/10 seats left/i);
  expect(seatCountText).toBeInTheDocument();
});

test(`reservation page shows 'sold out' message 
and NO purchase button if there are no seats available`, async () => {
  render(<Reservation showId={1} submitPurchase={jest.fn()} />); // SOLD OUT Show

  const soldOutMessage = await screen.findByRole('heading', {
    name: /sold out/i,
  });
  expect(soldOutMessage).toBeInTheDocument();

  // queryBy -  expect not to be in the document
  const purchaseButton = screen.queryByRole('button', {
    name: /purchase/i,
  });
  expect(purchaseButton).not.toBeInTheDocument();
});
