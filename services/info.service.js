const InfoDaoFactory = require('../daos/info/InfoDaoFactory.js')
const infoDao = InfoDaoFactory.getDaoInfo()

class InfoService {
    constructor() {
        this.info = infoDao
    }
    
    // returns info from system
    async getInfoSystem() {
        return await this.info.getInfoSystem()
    }
    
    // returns random numbers to test system
    async getRandom() {
        return await this.info.getRandom()
    }
}

module.exports = InfoService