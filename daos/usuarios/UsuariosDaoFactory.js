const UsuariosDaoMongoDB = require('./UsuariosDaoMongoDB.js')
// const UsuariosDaoArchivo = require('./UsuariosDaoArchivo.js')
//const UsuariosDaoMemoria = require('./UsuariosDaoMemoria.js')
//const { options }= require('../../options/config.js')

// const filePath = options.filePath.path
const cnxStr = process.env.MONGO_URL_CONNECT_ECOM

const option = process.env.PERSISTENCIA || 'Memoria'

let daoUsers
switch (option) {
    case 'Mongo':
        daoUsers = new UsuariosDaoMongoDB(cnxStr)
        daoUsers.init()
        break;
    // case 'File':
    //     daoUsers = new UsuariosDaoArchivo(filePath)
    //     daoUsers.init()
    //     break;    
     default:
         //daoUsers = new UsuariosDaoMemoria()
         daoUsers = new UsuariosDaoMongoDB(cnxStr)
         daoUsers.init()
         break;
}

module.exports = class UsuariosDaoFactory {
    static getDaoUsers() {
        return daoUsers
    }
}