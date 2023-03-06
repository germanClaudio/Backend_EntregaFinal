const fs = require("fs")
const logger = require('../utils/winston')

// --------------------- Files -----------------------------
module.exports = class ContainerMsg {
    constructor(configConnection) {
        console.log('config: ', configConnection)
        this.myFile = configConnection
    }

    async readFile() {
        try {
          const content = await fs.promises.readFile(this.myFile, "utf-8")
          const contentParsed = JSON.parse(content)
          return contentParsed
        } catch (error) {
            logger.error("Error leer archivo: " + error)
        }
      }

    async getAllMsg() {
        const fileContent = await this.readFile()
        try {
            if (fileContent.length !== 0) {
            return fileContent
            } else {
                logger.log("Lo sentimos, la lista de mensajes está vacía!!!")
            }
        } catch (error) {
            logger.error(`Error getting all messages ${error}`)
        }
    }
   
    async saveMsg(addMessage) {
        const fileContent = await this.readFile()
        if (addMessage !== undefined) {
            try {
                await fs.promises.writeFile(
                    this.myFile,
                  JSON.stringify([...fileContent, { ...addMessage, id: fileContent[fileContent.length - 1].id + 1} ], null, 2)
                )
                return fileContent
                
            } catch (error) {
                logger.error(error)
                return { Error: 'Upps! Hubo un error y no pudimos guardar el Mensaje.' }
            }
        } else {
            return { Error: 'Upps! We had some problems saving the mensaje, try later.' }
        }
    }
}    