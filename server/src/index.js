require('dotenv').config()
const { ApolloServer } = require('apollo-server')
const jwt = require('jsonwebtoken')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const connectDB = require('./config/db')

connectDB()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    console.log(req.headers['authorization'])

    const token = req.headers['authorization'] || ''

    if (token) {
      try {
        const user = await jwt.verify(token, process.env.SECRET)
        return {
          user
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})