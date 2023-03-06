const { dbConnection, dbDisconnection } = require('../../DB/configMongoDB.js')

class ContainerMongoDB {
    constructor(cnxStr) {
        this.cnxStr = cnxStr
        this.connection = dbConnection
        this.disconnection = dbDisconnection
    }
}

module.exports = ContainerMongoDB