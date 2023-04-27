import { test, expect } from '@jest/globals';
import { testApiHandler } from 'next-test-api-route-handler';

import { validateToken } from '@/lib/auth/utils';
import reservationsHandler from '@/pages/api/reservations/[reservationId]';
import userReservationsHandler from '@/pages/api/users/[userId]/reservations';

jest.mock('@/lib/auth/utils');
const mockValidateToken = validateToken as jest.Mock;

test('POST /api/reservations/[reservationId] adds reservation to user', async () => {
  const data = JSON.stringify({
    userId: 1,
    seatCount: 1,
    showId: 1,
  });

  await testApiHandler({
    handler: reservationsHandler,
    paramsPatcher: (params) => {
      params.reservationId = 12345;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });
      expect(res.status).toEqual(201);
    },
  });

  await testApiHandler({
    handler: userReservationsHandler,
    paramsPatcher: (params) => {
      params.userId = 1;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'GET',
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.userReservations).toHaveLength(3);
    },
  });
});

test('POST /api/reservations/[reservationId] returns 401 status when not authorized', async () => {
  mockValidateToken.mockResolvedValue(false);

  const data = JSON.stringify({
    userId: 1,
    seatCount: 1,
    showId: 1,
  });

  await testApiHandler({
    handler: reservationsHandler,
    paramsPatcher: (params) => {
      params.reservationId = 12345;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });
      expect(res.status).toEqual(401);
    },
  });
});
