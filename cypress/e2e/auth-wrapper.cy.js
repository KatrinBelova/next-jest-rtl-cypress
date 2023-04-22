it('runs auth flow for successful login to protected reservations page', () => {
  // visit reservation page for the first show (id=0)
  cy.task('db:reset').visit('/reservations/0');

  // check for sign in form
  cy.findByRole('heading', {
    name: /Sign in to your account/i,
  }).should('exist');

  // check that there's no option to purchase tickets
  cy.findByRole('button', { name: /purchase/i }).should('not.exist');

  // enter valid sign-in credentioals
  cy.findByLabelText(/email address/i)
    .clear()
    .type(Cypress.env('TEST_USER_EMAIL'));

  cy.findByLabelText(/password/i)
    .clear()
    .type(Cypress.env('TEST_PASSWORD'));

  // submit the form
  cy.findByRole('main').within(() => {
    cy.findByRole('button', { name: /sign in/i }).click();
  });

  // check for purchase button and band name
  cy.findByRole('button', { name: /purchase/i }).should('exist');
  cy.findByRole('heading', {
    name: /the wandering bunnies/i,
  });

  // check for email and sign-out btn on navbar
  cy.findByRole('button', { name: Cypress.env('TEST_USER_EMAIL') }).should(
    'exist'
  );
  cy.findByRole('button', { name: /sign out/i }).should('exist');

  // check that sign-in btn not exist
  cy.findByRole('button', { name: /sign in/i }).should('not.exist');
});
