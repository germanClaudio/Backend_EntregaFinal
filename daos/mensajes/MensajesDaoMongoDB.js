const ContainerMongoDB = require('../../contenedores/mensajes/containerMongoDB.js')

const Mensajes = require('../../models/mensajes.models.js')
const logger = require('../../utils/winston.js')
const now = require('../../utils/formatDate.js')

class MensajesDaoMongoDB extends ContainerMongoDB {
    constructor(cnxStr) {
        super(cnxStr) 
    }

    async init() {
        await this.connection
   }
    
    async getAllMessages(){
        try {
            const messages = await Mensajes.find()
            if(messages.length > 0){
                return messages
            }else{
                logger.info('No messages found')
            }
        } catch (error) {
            logger.error(error)
        }
    }

    async getMessageById(id) {
        if(id){
            try {
                const message = await Mensajes.findById({_id: id })
                return message
            } catch (error) {
                logger.error("Error MongoDB getOneMensaje: ",error)
            }
        } else {
            try {
                const messages = await Mensajes.find()
                return messages
            } catch (error) {
                logger.error("Error MongoDB getOneMessage: ",error)
            }
        }
    }

    async createNewMessage(mensaje){
                
        if(mensaje) {
            try {
                const newMessage = new Mensajes(mensaje)
                await newMessage.save()
                return newMessage
            } catch (error) {
                logger.error(error)
            }
        } else {
            return new Error (`No se pudo crear el Mensaje!`)
        }
    }

    async deleteMessageById(id) {
        const itemMongoDB = await Mensajes.findById({_id: `${id}`})
        if(itemMongoDB) {
            try {
                const newValues = {
                    author: itemMongoDB.author,
                    text: itemMongoDB.text,
                    date: now,
                    status: false
                }
                const mensaje = await Mensajes.findOneAndUpdate(
                    { _id: id }, newValues , { new: true })
                    return mensaje
            } catch (error) {
                logger.error("Error MongoDB deleteMenssage: ",error)
            }
        } else {
            logger.info('El Mensaje no existe! ', itemMongoDB)
        }
    }

    async disconnet() {
        await this.disconnection
    }

}

module.exports = MensajesDaoMongoDB 