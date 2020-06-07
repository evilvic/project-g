require('dotenv').config()
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Product = require('./models/Product')
const Client = require('./models/Client')
const Order = require('./models/Order')

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

    },
    
    getAllClients: async () => {
      try {
        const clients = await Client.find()
        return clients
      } catch (error) {
        console.log(error)
      }
    },

    getClientsBySalesman: async (_, {}, ctx) => {
      try {
        const clients = await Client.find({ salesman: ctx.user.id.toString() })
        return clients
      } catch (error) {
        console.log(error)
      }
    },

    getClient: async (_, { id }, ctx) => {

      const client = await Client.findById(id)
      if (!client) throw new Error('Client not found.')

      if (client.salesman.toString() !== ctx.user.id ) throw new Error('You have no access.')

      return client

    },

    getAllOrders: async () => {

      try {
        const orders = await Order.find()
        return orders
      } catch (error) {
        console.log(error)
      }

    },

    
    getOrdersBySalesman: async (_, {}, ctx) => {

      try {
        const orders = await Order.find({ salesman: ctx.user.id.toString() })
        return orders
      } catch (error) {
        console.log(error)
      }

    },

    getOrder: async (_, { id }, ctx) => {

      const order = await Order.findById(id)
      if (!order) throw new Error('Order not found.')

      if (order.salesman.toString() !== ctx.user.id ) throw new Error('You have no access.')

      return order

    },

    getOrderByState: async (_, { state }, ctx) => {

      const orders = await Order.find({ salesman: ctx.user.id.toString(), state })

      return orders

    },

    getBestClients: async () => {

      const clients = await Order.aggregate([
        { $match: { state: 'completed' } },
        { $group: {
          _id: '$client',
          total: { $sum: '$total' }
        } },
        {
          $lookup: {
            from: 'clients',
            localField: '_id',
            foreignField: '_id',
            as: 'clients'
          }
        },
        {
          $limit: 10
        },
        {
          $sort : { total: -1 }
        }
      ])

      return clients  

    },

    getBestSalesmen: async () => {

      const salesmen = await Order.aggregate([
        { $match: { state: 'completed' } },
        { $group: {
          _id: '$salesman',
          total: { $sum: '$total' }
        } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'salesmen'
          }
        },
        {
          $limit: 3
        },
        {
          $sort : { total: -1 }
        }
      ])

      return salesmen

    },

    searchProduct: async (_, { text }) => {

      const products = await Product.find({ $text: { $search: text } }).limit(10)

      return products

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
        await newUser.save()
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
        const newProduct = new Product(input)
        await newProduct.save()
        return newProduct
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

      const product = await Product.findById(id)
      if (!product) throw new Error('Product does not exist.')

      await Product.findOneAndDelete({ _id: id})

      return 'Product removed.'

    },

    createClient: async (_, { input }, ctx) => {

      const { email } = input

      const client = await Client.findOne({ email })
      if (client) throw new Error('Client already exist.')

      try {
        const newClient = new Client(input)
        newClient.salesman = ctx.user.id
        await newClient.save()
        return newClient
      } catch (error) {
        console.log(error)
      }

    },

    updateClient: async (_, { id, input }, ctx) => {

      let client = await Client.findById(id)
      if (!client) throw new Error('Client not found.')

      if (client.salesman.toString() !== ctx.user.id ) throw new Error('You have no access.')

      client = await Client.findOneAndUpdate({ _id: id }, input, { new: true })

      return client

    },

    deleteClient: async (_, { id }, ctx) => {

      const client = await Client.findById(id)
      if (!client) throw new Error('Client not found.')

      if (client.salesman.toString() !== ctx.user.id ) throw new Error('You have no access.')

      await Client.findOneAndDelete({ _id: id})

      return 'Client removed.'

    },

    createOrder: async (_, { input }, ctx) => {

      const { client: id, products } = input

      let client = await Client.findById(id)
      if (!client) throw new Error('Client not found.')

      if (client.salesman.toString() !== ctx.user.id ) throw new Error('You have no access.')

      for await (const item of products) {

        const { id } = item

        const product = await Product.findById(id)

        if (item.quantity > product.existence) {
          throw new Error(`The item "${product.name}" does not have enough stock.`)
        } else {
          product.existence -= item.quantity
          await product.save()
        }

      }

      const order = new Order(input)
      order.salesman = ctx.user.id
      await order.save()
      return order

    },

    updateOrder: async (_, { id, input }, ctx) => {

      const { client: clientId, products } = input

      let order = await Order.findById(id)
      if (!order) throw new Error('Order not found.')

      let client = await Client.findById(clientId)
      if (!client) throw new Error('Client not found.')
  
      if (client.salesman.toString() !== ctx.user.id ) throw new Error('You have no access.')


      if(products) {

        for await (const item of products) {
  
          const { id } = item
  
          const product = await Product.findById(id)
  
          if (item.quantity > product.existence) {
            throw new Error(`The item "${product.name}" does not have enough stock.`)
          } else {
            product.existence -= item.quantity
            await product.save()
          }
  
        }

      }
  
      order = await Order.findOneAndUpdate({ _id: id }, input, { new: true })
  
      return order

    },

    deleteOrder: async (_, { id }, ctx) => {

      const order = await Order.findById(id)
      if (!order) throw new Error('Order not found.')

      if (order.salesman.toString() !== ctx.user.id ) throw new Error('You have no access.')

      await Order.findOneAndDelete({ _id: id})

      return 'Order removed.'

    },

  }
}

module.exports = resolvers