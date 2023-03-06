const { Router } = require('express')
const infoRouter = Router()

const { checkAuthentication } = require('../middlewares/chekAuthentication')
const { authUserMiddleware, authProductMiddleware } = require('../middlewares/authUser.middleware.js')

const GetInfo = require('../controllers/info.controller.js')
const getInformation = GetInfo.InfoController
const info = new getInformation()

const logger = require('../utils/winston')

//-------------- Routes System -----------------------------
infoRouter.get('/system', checkAuthentication, authUserMiddleware, info.getInfoSystem)

infoRouter.post('/randoms', checkAuthentication, authUserMiddleware, info.getRandom)

module.exports = {
     infoRouter
} 