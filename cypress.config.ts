import { defineConfig } from 'cypress';
import { addBand } from './lib/features/bands/queries';
import { resetDB } from './__tests__/__mocks__/db/utils/reset-db';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        // deconstruct the individual properties
        'db:reset': () => resetDB().then(() => null),
        addBand: (newBand) => addBand(newBand).then(() => null),
      });
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
