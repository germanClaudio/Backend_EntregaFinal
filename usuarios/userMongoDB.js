const mongoose = require('mongoose');
const Usuarios = require('../models/usuarios.models')
const logger = require('../utils/winston.js')

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

    async getUser(){
        try {
            const users = await Usuarios.find()
            logger.info('Usuarios', users)
        } catch (error) {
            logger.error(error)
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

    // async getUserByUsernameAndPassword(username, password) { 
    //     logger.info('Username&pass', username)
    //     try {
    //         const user = await Usuarios.findOne( {username: `${username}`, password: `${password}` } )
            
    //         if ( user === [] || user === undefined || user === null) {
    //             return false    
    //         } else {
    //             return true
    //         }
    //     } catch (error) {
    //         logger.error(error)
    //     }
    // }
}

module.exports = { ServerMongoDB }