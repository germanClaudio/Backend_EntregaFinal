const InfoDaoMongoDB = require('./InfoDaoMongoDB.js')
// const UsuariosDaoArchivo = require('./UsuariosDaoArchivo.js')
//const UsuariosDaoMemoria = require('./UsuariosDaoMemoria.js')
//const { options }= require('../../options/config.js')

// const filePath = options.filePath.path
const cnxStr = process.env.MONGO_URL_CONNECT_ECOM

const option = process.env.PERSISTENCIA || 'Memoria'

let daoInfo
switch (option) {
    case 'Mongo':
        daoInfo = new InfoDaoMongoDB(cnxStr)
        daoInfo.init()
        break;
    // case 'File':
    //     daoUsers = new UsuariosDaoArchivo(filePath)
    //     daoUsers.init()
    //     break;    
    // default:
    //     daoUsers = new UsuariosDaoMemoria()
    //     break;
}

module.exports = class InfoDaoFactory {
    static getDaoInfo() {
        return daoInfo
    }
}