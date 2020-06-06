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
    },

    getAllProducts: async () => {
      try {
        const products = await Product.find()
        return products
      } catch (error) {
        console.log(error)
      }
    },

    getProduct: async (_, { id }) => {

      const product = await Product.findById(id)
      if (!product) throw new Error('Product does not exist.')

      return product

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

    },

    createProduct: async (_, { input }) => {

      try {
        const product = new Product(input)
        const newProuct = await product.save()
        return newProuct
      } catch (error) {
        console.log(error)
      }

    },

    updateProduct: async (_, { id, input }) => {

      let product = await Product.findById(id)
      if (!product) throw new Error('Product does not exist.')

      product = await Product.findOneAndUpdate({ _id: id }, input, { new: true })

      return product

    },

    deleteProduct: async (_, { id }) => {

      let product = await Product.findById(id)
      if (!product) throw new Error('Product does not exist.')

      await Product.findOneAndDelete({ _id: id})

      return 'Product removed.'

    }

  }
}

module.exports = resolvers