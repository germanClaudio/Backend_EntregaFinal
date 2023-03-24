const MensajesDaoFactory = require('../daos/mensajes/MensajesDaoFactory.js')
const mensajesDao = MensajesDaoFactory.getDaoMsg()

class MessageService {
    constructor() {
        this.messages = mensajesDao
    }
    
    // returns all messages from DB
    async getAllMessages() {
        return await this.messages.getAllMessages()
    }
    
    // returns one message by id
    async getMessageById(id) {
        return await this.messages.getMessageById(id)
    }

    // add new message
    async createNewMessage(message) {
        return await this.messages.createNewMessage(message)
    }
    
    // delete one message by Id
    async deleteMessageById(id) {
        return await this.messages.deleteMessageById(id)
    }

    // delete all messages
    async deleteAllMessages() {
        return await this.messages.deleteAllMessages()
    }
}

module.exports = MessageService