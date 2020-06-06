const { gql } = require('apollo-server')

const typeDefs = gql`

  type User {
    id: ID
    name: String
    surname: String
    email: String
    createdAt: String
  }

  input UserInput {
    name: String!
    surname: String!
    email: String!
    password: String!
  }

  type Query {

    dummyQuery: String

  }

  type Mutation {

    createUser(input: UserInput): User

  }

`

module.exports = typeDefs