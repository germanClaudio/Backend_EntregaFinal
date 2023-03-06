const { Schema, model } = require('mongoose')
const now = require('../utils/formatDate.js')

const ProductoSchema = new Schema({
    name: {
        type: String,
        maxlength: 100,
        value: 'Perfume'
    },
    description: {
        type: String,
        maxlength: 100
    },
    price: {
        type: Number,
        value: 1,
        maxlength: 100,
        min: [1, 'Price can not be less than 1.']
    },
    picture: { 
        type: String,
        maxlength: 500,
        value: 'Picture not found'
    },
    code:{
        type: String,
        maxlength: 5,
        unique: true,
        value: 'AA01'
    },
    stock:{
        type: Number,
        maxlength: 100,
        min: [0, 'Stock can not be less than 0.'],
        value: 1
    },
    category:{
        type: String,
        default: 'Perfumes',
        maxlength: 50
    },
    timestamp: {
        type: String,
        default: now,
    }    
},{
    versionKey: false
})

module.exports = model('Products', ProductoSchema)