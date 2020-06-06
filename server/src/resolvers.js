require('dotenv').config()
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Product = require('./models/Product')

const createToken = (user, secret, expiresIn) => {
  const { id, name, surname, email } = user
  return jwt.sign({ id, name, surname, email }, secret, { expiresIn })
}

const resolvers = {
  Query: {
    
    getUser: async (_, { token }) => {
      const user = await jwt.verify(token, process.env.SECRET)
      return user
    }

  },
  Mutation: {

    createUser: async (_, { input }) => {

      const { email, password } = input

      const userExist = await User.findOne({ email })
      if (userExist) throw new Error('User already register.')

      const salt = await bcryptjs.genSalt(10)
      input.password = await bcryptjs.hash(password, salt)

      try {
        const newUser = new User(input)
        newUser.save()
        return newUser
      } catch (error) {
        console.log(error)
      }

    },

    authenticateUser: async (_, { input }) => {

      const { email, password } = input

      const userExist = await User.findOne({ email })
      if (!userExist) throw new Error('User does not exist.')

      const correctPassword = await bcryptjs.compare(password, userExist.password)
      if (!correctPassword) throw new Error('The password is incorrect.')

      return {
        token: createToken(userExist, process.env.SECRET, '24h')
      }

    }

  }
}

module.exports = resolvers