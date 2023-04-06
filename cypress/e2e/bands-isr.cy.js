it('skips client-side bundle, confirming data from ISR cache', () => {
  // reference: https://glebbahmutov.com/blog/ssr-e2e/
  cy.request('/bands')
    .its('body')
    .then((html) => {
      // remove the scripts, so they don't start automaticly
      const staticHtml = html.replace(/<script.*?>.*?<\/script>/gm, '');
      cy.state('document').write(staticHtml);
    });
  // now we can use "normal" Cypress api to confirm
  // number of list element

  cy.findByRole('heading', { name: /The Wandering Bunnies/i }).should('exist');
  cy.findByRole('heading', { name: /Shamrock Pete/i }).should('exist');
  cy.findByRole('heading', { name: /The Joyous Nun Riot/i }).should('exist');
});
