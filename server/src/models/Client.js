const { model, Schema } = require('mongoose')

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String
    },
    salesman: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

module.exports = model('Client', clientSchema)