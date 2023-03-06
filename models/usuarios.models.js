const { Schema, model } = require('mongoose')
const now = require('../utils/formatDate.js')

const userSchema = new Schema({
    name: {
        type: String,
        maxlength: 100
    },
    lastName: {
        type: String,
        maxlength: 100
    },
    email: { 
        type: String,
        required: true,
        maxlength: 100,
        unique: true,
    },
    username: { 
        type: String,
        required: true,
        maxlength: 100
    },
    avatar: { 
        type: String,
        maxlength: 750
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: false,
        default: false
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    timestamp: {
        type: String,
        default: now,
    }  
})

module.exports = model('Usuarios', userSchema)