const CarritosDaoMongoDB = require('./CarritosDaoMongoDB.js')
//const ProductosDaoArchivo = require('./ProductosDaoArchivo.js')
//const ProductosDaoMemoria = require('./ProductosDaoMemoria.js')
const { options }= require('../../options/config.js')

//const filePath = options.filePath.path
const cnxStr = process.env.MONGO_URL_CONNECT_ECOM

const option = process.env.PERSISTENCIA || 'Memoria'

let dao
switch (option) {
    case 'Mongo':
        dao = new CarritosDaoMongoDB(cnxStr)
        dao.init()
        break;
    // case 'File':
    //     dao = new ProductosDaoArchivo(filePath)
    //     dao.init()
    //     break;    
    // default:
    //     dao = new ProductosDaoMemoria()
    //     break;
}

module.exports = class CarritosDaoFactory {
    static getDaoCart() {
        return dao
    }
}