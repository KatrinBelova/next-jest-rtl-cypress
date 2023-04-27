import { expect } from '@jest/globals';
// do not import jest - cause conflicts when mocking function
// jest is in .eslint env
import { testApiHandler } from 'next-test-api-route-handler';

import { validateToken } from '@/lib/auth/utils';
import userReservationsHandler from '@/pages/api/users/[userId]/reservations';
import userAuthHandler from '@/pages/api/users/index';

jest.mock('@/lib/auth/utils');
const mockValidateToken = validateToken as jest.Mock;

test('POST /api/users receives token with correct credentials', async () => {
  await testApiHandler({
    handler: userAuthHandler,
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'POST',
        headers: {
          'content-type': 'application/json', // Must use correct content type
        },
        body: JSON.stringify({
          email: 'test@test.test',
          password: 'test',
        }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();

      expect(json).toHaveProperty('user');
      expect(json.user.id).toEqual(1);
      expect(json.user.email).toEqual('test@test.test');
      expect(json.user).toHaveProperty('token');
    },
  });
});

test('GET /api/user/[userId]/reservations returns correct number of reservations', async () => {
  await testApiHandler({
    handler: userReservationsHandler,
    paramsPatcher: (params) => {
      params.userId = 1;
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });
      expect(res.status).toEqual(200);
      const json = await res.json();

      expect(json.userReservations).toHaveLength(2);
    },
  });
});

test('GET /api/user/[userId]/reservations returns no reservations if user does not exist', async () => {
  await testApiHandler({
    handler: userReservationsHandler,
    paramsPatcher: (params) => {
      params.userId = 12345;
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });
      const json = await res.json();

      expect(res.status).toEqual(200);
      expect(json.userReservations).toHaveLength(0);
    },
  });
});

test('GET /api/user/[userId]/reservations returns 401 status when anauthenticated', async () => {
  mockValidateToken.mockResolvedValue(false);

  await testApiHandler({
    handler: userReservationsHandler,
    paramsPatcher: (params) => {
      params.userId = 1;
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });
      expect(res.status).toBe(401);
    },
  });
});
