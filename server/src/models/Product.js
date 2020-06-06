const { model, Schema } = require('mongoose')

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    existence: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true,
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

module.exports = model('Product', productSchema)