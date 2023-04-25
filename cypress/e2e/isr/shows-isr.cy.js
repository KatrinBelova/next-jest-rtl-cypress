it('skips client-side bundle, confirming data from ISR cache', () => {
  // reference: https://glebbahmutov.com/blog/ssr-e2e/
  // BETTER way is to search for particular page. https://nextjs.org/docs/deployment#nextjs-build-api
  // RECOMMENDED:  next-bundle-analyzer

  cy.request('/shows')
    .its('body')
    .then((html) => {
      // remove the scripts, so they don't start automaticly
      const staticHtml = html.replace(/<script.*?>.*?<\/script>/gm, '');
      cy.state('document').write(staticHtml);
    });
  // now we can use "normal" Cypress api to confirm
  // number of list element

  cy.findAllByText(/2022 apr 1[456]/i).should('have.length.of', 3);
});
