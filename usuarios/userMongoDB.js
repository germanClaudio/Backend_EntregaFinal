const mongoose = require('mongoose');
const Usuarios = require('../models/usuarios.models')

class ServerMongoDB {
    constructor() {
        this.connect()
    }
    
    connect() {
        try {
            const URL = process.env.MONGO_URL_CONNECT_ECOM
            mongoose.connect(URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            console.log('Connected to MongoDB Server 3-2-1')
            
        } catch (error) {
            console.error('Error connection to DB: '+error)
        }
    }

    async getUserByUsername(username){
        try {
            const user = await Usuarios.findOne( {username: `${username}`} )
            return user
        } catch (error) {
            logger.error(error)
        }
    }
}

module.exports = { ServerMongoDB }