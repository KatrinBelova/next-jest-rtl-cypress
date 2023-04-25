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

it('runs the auth fail for protected route', () => {
  // visit user page
  cy.task('db:reset').visit('/user');

  // check for sign in and no user info
  cy.findByRole('heading', {
    name: /Sign in to your account/i,
  }).should('exist');
  cy.findByRole('heading', {
    name: /welcome/i,
  }).should('not.exist');

  // enter NOT valid info and fail login
  cy.findByLabelText(/email address/i)
    .clear()
    .type('scam@gmail.com');
  cy.findByLabelText(/password/i)
    .clear()
    .type('scamuser');

  cy.findByRole('main').within(() => {
    cy.findByRole('button', {
      name: /sign in/i,
    }).click();
  });

  // check that sign was failed
  cy.findByText(/Sign in failed/i).should('exist');

  // enter valid info and login
  cy.findByLabelText(/email address/i)
    .clear()
    .type(Cypress.env('TEST_USER_EMAIL'));
  cy.findByLabelText(/password/i)
    .clear()
    .type(Cypress.env('TEST_PASSWORD'));

  cy.findByRole('main').within(() => {
    cy.findByRole('button', {
      name: /sign in/i,
    }).click();
  });

  // check navbar  for user email and sign out button
  cy.findByRole('heading', {
    name: /Welcome/i,
  }).should('exist');
  cy.findByRole('button', {
    name: Cypress.env('TEST_USER_EMAIL'),
  }).should('exist');
  cy.findByRole('button', {
    name: /sign out/i,
  }).should('exist');
  cy.findByRole('button', {
    name: /sign in/i,
  }).should('not.exist');

  cy.findByRole('button', {
    name: /sign out/i,
  }).click();
});

it('redirects to sign-in for protected pages', () => {
  cy.fixture('protected-pages').then((urls) => {
    urls.forEach(($url) => {
      cy.visit($url);

      cy.findByLabelText(/email address/i).should('exist');
      cy.findByLabelText(/password/i).should('exist');
    });
  });
});

it('does not show sign-in page when already signed in', () => {
  cy.task('db:reset').signIn(
    Cypress.env('TEST_USER_EMAIL'),
    Cypress.env('TEST_PASSWORD')
  );

  // access tikets/reservations page
  cy.visit('/reservations/0');

  // make sure threr's no sign in
  cy.findByRole('heading', {
    name: /sign in to your account/i,
  }).should('not.exist');

  // make sure ticket purchase button shows
  cy.findByRole('button', {
    name: /purchase/i,
  }).should('exist');
});
