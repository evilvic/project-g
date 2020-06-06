const { model, Schema } = require('mongoose')

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
)

module.exports = model('User', userSchema)