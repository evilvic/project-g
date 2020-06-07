const { model, Schema } = require('mongoose')

const orderSchema = new Schema(
  {
    products: {
      type: Array,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    salesman: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    state: {
      type: String,
      default: 'pending'
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

module.exports = model('Order', orderSchema)