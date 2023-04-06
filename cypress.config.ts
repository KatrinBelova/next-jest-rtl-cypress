import { defineConfig } from 'cypress';
import { addBand } from './lib/features/bands/queries';
import { addReservation } from './lib/features/reservations/queries';
import { resetDB } from './__tests__/__mocks__/db/utils/reset-db';

export default defineConfig({
  projectId: '1u1dnp',
  e2e: {
    setupNodeEvents(on, config) {
      config.env.REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;
      // to access within a test function:
      // Cypress.env('REVALIDATION_SECRET')

      // implement node event listeners here
      on('task', {
        // deconstruct the individual properties
        'db:reset': () => resetDB().then(() => null),
        addBand: (newBand) => addBand(newBand).then(() => null),
        addReservation: (newReservation) =>
          addReservation(newReservation).then(() => null),
      });

      return config;
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
