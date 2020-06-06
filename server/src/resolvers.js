const bcryptjs = require('bcryptjs')
const User = require('./models/User')

const resolvers = {
  Query: {
    
    dummyQuery: () => 'his is a dummy query.'
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

    }

  }
}

module.exports = resolvers