require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log(`🦄 Connected to MongoDB Atlas! Database name: ${mongoose.connections[0].name}`)
  } catch (error) {
    console.error('❌ Error connecting to DB...', error)
    process.exit(1)
  }
}

module.exports = connectDB