const { gql } = require('apollo-server')

const typeDefs = gql`

  type User {
    id: ID
    name: String
    surname: String
    email: String
    createdAt: String
  }

  type Token {
    token: String
  }

  type Product {
    id: ID
    name: String
    existence: Int
    price: Float
    createdAt: String
  }

  input UserInput {
    name: String!
    surname: String!
    email: String!
    password: String!
  }

  input AuthenticateInput {
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    existence: Int!
    price: Float!
  }

  type Query {

    # Users
    getUser(token: String!): User

    # Products
    getAllProducts: [Product]
    getProduct(id: ID!): Product

  }

  type Mutation {

    # Users
    createUser(input: UserInput): User
    authenticateUser(input: AuthenticateInput): Token

    # Products
    createProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

  }

`

module.exports = typeDefs