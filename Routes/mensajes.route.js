const { Router } = require('express')
const routerMensajes = Router()
const { authMiddleware } = require('../middlewares/auth.middleware.js')
const { checkAuthentication } = require('../middlewares/chekAuthentication.js')
const { authUserMiddleware, authProductMiddleware } = require('../middlewares/authUser.middleware.js')

const GetMessages = require('../controllers/mensajes.controller.js')
const getMessages = GetMessages.MessagesController
const messages = new getMessages()

// -------------------  Seleccionar todos los Mensajes ------------------
routerMensajes.get('/', checkAuthentication, authUserMiddleware, messages.getAllMessages)

// -------------------  Seleccionar Mensaje por Id ------------------ 
routerMensajes.get('/:id', checkAuthentication, authUserMiddleware, messages.getMessageById)

// -------------------  Crear Nuevo Mensaje ------------------------ 
routerMensajes.post('/', checkAuthentication, authUserMiddleware, messages.createNewMessage)

// -------------------  Eliminar Mensaje por Id ------------------ 
routerMensajes.get('/delete/:id', checkAuthentication, authUserMiddleware, messages.deleteMessageById)

module.exports = routerMensajes