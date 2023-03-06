const { Schema, model, mongoose } = require('mongoose')
const now = require('../utils/formatDate.js')

let ItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
    },
    name: {
        type: String,
        maxlength: 100
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity can not be less than 0.']
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true,
    }
}, {
    timestamp: {
        type: String,
        default: now,
    }
})
const cartSchema = new Schema({
    items: [ItemSchema],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuarios"
    },
    subTotal: {
        default: 0,
        type: Number
    },
    active: {
        type: Boolean,
        default: true
    },
    modifiedOn: {
        type: String,
        default: now,
    },
    username: {
        type: String,
    }
}, {
    timestamp: true
    }  
)

module.exports = model('Carts', cartSchema)