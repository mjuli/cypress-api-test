/// <reference types="cypress" />

describe('Login - Teste de API', () => {
  it('Deve realizar o login com sucesso', () => {
    cy.login('fulano@qa.com', 'teste')
      .then((response) => {
        expect(response).property('status').to.equal(200)
        expect(response).property('body').to.have.property('authorization')
        expect(response).property('body').to.have.property('message').to.eq('Login realizado com sucesso')
        expect(response).to.include.keys('headers', 'duration')
      })
  });

  it('Não deve realizar o login ao inserir um email inválido', () => {
    const email = `email${Math.floor(Math.random() * 100_000)}@email.com`

    cy.login(email, 'teste')
      .then((response) => {
        expect(response).property('status').to.equal(401)
        expect(response).property('body').to.have.property('message').to.eq('Email e/ou senha inválidos')
        expect(response).to.include.keys('headers', 'duration')
      })
  });

  it('Não deve realizar o login ao inserir uma senha inválida', () => {
    const senha = "senha" + Math.floor(Math.random() * 100_000)

    cy.login('fulano@qa.com', senha)
      .then((response) => {
        expect(response).property('status').to.equal(401)
        expect(response).property('body').to.have.property('message').to.eq('Email e/ou senha inválidos')
        expect(response).to.include.keys('headers', 'duration')
      })
  });
});