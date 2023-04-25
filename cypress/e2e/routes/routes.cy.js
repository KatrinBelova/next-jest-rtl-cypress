import { generateNewBand } from '@/__tests__/__mocks__/fakeData/newBand';
import { generateRandomId } from '@/lib/features/reservations/utils';

it('displays correct heading when navigating to shows route', () => {
  cy.visit('/');
  cy.findByRole('button', {
    name: /shows/i,
  }).click();
  cy.findByRole('heading', {
    name: /upcoming shows/i,
  }).should('exist');
});

it('navigate to bands route and display bands heading', () => {
  cy.visit('/');
  cy.findByRole('button', {
    name: /bands/i,
  }).click();
  cy.findByRole('heading', {
    name: /Our Illustrious Performers/i,
  }).should('exist');
});

// it('resets the DB', () => {
//   cy.task('db:reset');
// });

// !!! the best practice to reset DB at the beginning of the test
// BUT^ cache reset could be at the end (time-consuming task)

// NOTE: process.env.NODE_ENV doesn't set to 'test' automaticly
// need to check ---->>> process.env.CYPRESS
// like in file /__tests__/__mocks__/db/utils/reset-db.ts

it('displays correct band name for band route that existed at build time', () => {
  cy.task('db:reset').visit('/bands/1');
  cy.findByRole('heading', {
    name: /Shamrock Pete/i,
  }).should('exist');
});

it("displays error, when band doen't exist", () => {
  cy.task('db:reset').visit('/bands/231');
  cy.findByRole('heading', {
    name: /error: band not found/i,
  }).should('exist');
});

it('displays name for band that was not present at build time', () => {
  const bandId = generateRandomId();
  const newBand = generateNewBand(bandId);
  cy.task('db:reset').task('addBand', newBand).visit(`/bands/${bandId}`);
  cy.findByRole('heading', {
    name: /Metalica/i,
  }).should('exist');
});
