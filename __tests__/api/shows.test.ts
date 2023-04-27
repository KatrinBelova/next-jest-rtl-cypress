import { expect, jest, test } from '@jest/globals';
import { testApiHandler } from 'next-test-api-route-handler';
// Import the handler under test from the pages/api directory
import showsHandler from '@/pages/api/shows/index';
import showIdHandler from '@/pages/api/shows/[showId]';
// import type { PageConfig } from 'next';
import { readFakeData } from '@/__tests__/__mocks__/fakeData';

// Respect the Next.js config object if it's exported
// const handler: typeof endpoint & { config?: PageConfig } = endpoint;
// handler.config = config;

it('/api/shows returns shows from database', async () => {
  await testApiHandler({
    handler: showsHandler,
    // requestPatcher: (req) => (req.headers = { key: process.env.SPECIAL_TOKEN }),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });

      expect(res.status).toBe(200);

      const json = await res.json();
      const { fakeShows } = await readFakeData();

      expect(json).toEqual({ shows: fakeShows });
    },
  });
});

test('GET /api/shows/[showId] returns the data for the correct show ID', async () => {
  await testApiHandler({
    handler: showIdHandler,
    paramsPatcher: (params) => {
      params.showId = 0;
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });

      expect(res.status).toBe(200);

      const json = await res.json();
      const { fakeShows } = await readFakeData();

      expect(json).toEqual({ show: fakeShows[0] });
    },
  });
});

test('POST /api/shows returns 401 status for incorrect revalidation secret', async () => {
  await testApiHandler({
    handler: showsHandler,
    paramsPatcher(params) {
      params.queryStringURLParams = {
        secret: 'NOT THE REAL SECRET',
      };
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'POST' });
      expect(res.status).toBe(401);
    },
  });
});
