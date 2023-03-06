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
    },
    price: {
        type: Number,
    },
    total: {
        type: Number,
    }
})

let ShippingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuarios",
    },
    name: { 
        type: String,
    },
    lastName: {
        type: String,
    },
    username:{
        type: String,
    },
    email: {
        type: String,
    }
})

const orderSchema = new Schema({
    shipping: [ShippingSchema],
    items: [ItemSchema],
    subTotal: {
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
    invoice_nr: {
        type: String,
    }
}, {
    timestamp: true
}  
)

module.exports = model('Orders', orderSchema)