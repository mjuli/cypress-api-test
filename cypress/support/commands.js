// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method            : 'POST',
    url               : '/login',
    body              : {
      "email": email,
      "password": password
    },
    "failOnStatusCode": false
  })
})

Cypress.Commands.add('token', (email, password) => {
  cy.request('POST', '/login', {
    "email": email,
    "password": password
  })
    .then((response) => {
      expect(response).property('status').to.equal(200)
      expect(response).property('body').to.have.property('authorization')
      return response.body.authorization
    })
})

Cypress.Commands.add('cadastrarProduto', (token, productName, preco, descricao, quantidade) => {
  cy.request({
    method            : 'POST',
    url               : '/produtos',
    headers           : { "authorization": token },
    body              : {
      "nome"      : productName,
      "preco"     : preco,
      "descricao" : descricao,
      "quantidade": quantidade
    },
    "failOnStatusCode": false
  })
})
