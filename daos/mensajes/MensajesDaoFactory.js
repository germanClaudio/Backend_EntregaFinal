const MensajesDaoMongoDB = require('./MensajesDaoMongoDB.js')

// const filePath = options.filePath.path
const cnxStr = process.env.MONGO_URL_CONNECT_ECOM

const option = process.env.PERSISTENCIA || 'Memoria'

let daoMsg
switch (option) {
    case 'Mongo':
        daoMsg = new MensajesDaoMongoDB(cnxStr)
        daoMsg.init()
        break;
    // case 'File':
    //     daoUsers = new UsuariosDaoArchivo(filePath)
    //     daoUsers.init()
    //     break;    
     default:
         daoMsg = new MensajesDaoMongoDB(cnxStr)
         daoMsg.init()
         break;
}

module.exports = class MansajesDaoFactory {
    static getDaoMsg() {
        return daoMsg
    }
}