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

  type Client {
    id: ID
    name: String
    surname: String
    company: String
    email: String
    phone: String
    salesman: ID
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

  input ClientInput {
    name: String!
    surname: String!
    company: String!
    email: String!
    phone: String
  }

  type Query {

    # Users
    getUser(token: String!): User

    # Products
    getAllProducts: [Product]
    getProduct(id: ID!): Product

    # Clients
    getAllClients: [Client]
    getClientsBySalesman: [Client]
    getClient(id: ID!): Client

  }

  type Mutation {

    # Users
    createUser(input: UserInput): User
    authenticateUser(input: AuthenticateInput): Token

    # Products
    createProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    # Clients
    createClient(input: ClientInput): Client
    updateClient(id: ID!, input: ClientInput): Client
    deleteClient(id: ID!): String

  }

`

module.exports = typeDefs