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

  input UserInput {
    name: String!
    surname: String!
    email: String!
    password: String!
  }

  input authenticateInput {
    email: String!
    password: String!
  }

  type Query {

    getUser(token: String!): User

  }

  type Mutation {

    createUser(input: UserInput): User
    authenticateUser(input: authenticateInput): Token

  }

`

module.exports = typeDefs