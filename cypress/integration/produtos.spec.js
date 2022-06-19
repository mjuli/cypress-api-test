/// <reference types='cypress' />

const productSchema = require('../contracts/produto.contract')

describe('Testes da Funcionalidade Produtos', () => {
  let token

  before(() => {
    cy.token('fulano@qa.com','teste').then(tkn => { token = tkn })
  });

  it('Deve validar o contrato de produtos', () => {
    cy.request('/produtos')
      .then(response => {
        return productSchema.validateAsync(response.body)
      })
  })

  it('Deve listar produtos cadastrados', () => {
    cy.request('/produtos')
      .then((response) => {
        expect(response).to.include.keys('headers', 'duration')
        expect(response).property('status').to.equal(200)
        expect(response).property('body').to.have.property('quantidade')
        expect(response).property('body').to.have.property('produtos').and.to.be.an('array')
      })
  });

  it('Deve cadastrar um novo produto com sucesso', () => {
    const productName = "Produto " + Math.floor(Math.random() * 100_000)

    cy.cadastrarProduto(token, productName, Math.floor(Math.random() * 1000), "Produto", Math.floor(Math.random() * 1000))
      .then((response) => {
        expect(response).to.include.keys('headers', 'duration')
        expect(response).property('status').to.equal(201)
        expect(response).property('body').to.have.property('_id')
        expect(response).property('body').to.have.property('message').to.eq('Cadastro realizado com sucesso')
      })
  });

  it('Não deve permitir cadastrar um produto repetido', () => {
    const productName = "Produto " + Math.floor(Math.random() * 100_000)

    cy.cadastrarProduto(token, productName, Math.floor(Math.random() * 1000), "Produto", Math.floor(Math.random() * 1000))
    .then((response) => {
      cy.cadastrarProduto(token, productName, 100, "Produto", 100)
        .then((response) => {
          expect(response).property('status').to.equal(400)
          expect(response).property('body').to.have.property('message').to.eq('Já existe produto com esse nome')
          expect(response).to.include.keys('headers', 'duration')
        })
    })
  });

  it('Deve editar um produto previamente cadastrado', () => {
    const name = "Produto " + Math.floor(Math.random() * 100_000)

    cy.cadastrarProduto(token, name, Math.floor(Math.random() * 1000), "Produto", Math.floor(Math.random() * 1000))
      .then(response => {
        expect(response).property('status').to.equal(201)

        cy.request({
          method: 'PUT',
          url: `/produtos/${response.body._id}`,
          headers: { "authorization": token },
          body: {
            "nome"      : name,
            "preco"     : Math.floor(Math.random() * 1000),
            "descricao" : 'Produto editado',
            "quantidade": Math.floor(Math.random() * 1000)
          }
        })
          .then(response => {
            expect(response).to.include.keys('headers', 'duration')
            expect(response).property('status').to.equal(200)
            expect(response).property('body').to.have.property('message').to.eq('Registro alterado com sucesso')
          })
      })
  });

  it('Deve deletar um produto previamente cadastrado', () => {
    const name = "Produto " + Math.floor(Math.random() * 100_000)

    cy.cadastrarProduto(token, name, Math.floor(Math.random() * 1000), "Produto", Math.floor(Math.random() * 1000))
      .then(response => {
        expect(response).property('status').to.equal(201)

        cy.request({
          method: 'DELETE',
          url: `/produtos/${response.body._id}`,
          headers: { "authorization": token },
        })
          .then(response => {
            expect(response).to.include.keys('headers', 'duration')
            expect(response).property('status').to.equal(200)
            expect(response).property('body').to.have.property('message').to.eq('Registro excluído com sucesso')
          })
      })
  });
});