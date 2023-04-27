import { test, expect } from '@jest/globals';
import { testApiHandler } from 'next-test-api-route-handler';
import bandsHandler from '@/pages/api/bands/index';

test('POST /api/bands returns 401 status when not authorized', async () => {
  await testApiHandler({
    handler: bandsHandler,
    paramsPatcher: (params) => {
      params.queryStringURLParams = {
        secret: 'NOT VALID REVALIDATION SECRET',
      };
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'POST',
      });
      expect(res.status).toBe(401);
    },
  });
});
