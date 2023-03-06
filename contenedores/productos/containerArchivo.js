const fs = require("fs")

module.exports = class ContainerArchivo {

  #ready = false

  constructor(filePath) {
    this.filePath = filePath
  }

  async init() {
    try {
        await fs.promises.readFile(this.filePath, 'utf-8')
        this.#ready = true
        console.log('Productos Dao en archivo init -> listo')
    } catch (error) {
        await fs.promises.writeFile(this.filePath, '[]')
        this.#ready = true
        console.log('Productos Dao en archivo -> listo')
    }
  }

  async disconnect() {
    console.log('Productos Dao en archivo -> cerrado')
}

  #checkReady() {
    if (!this.#ready) throw new Error('INTERNAL_ERROR: dao no conectado!')
}

  async readFile() {
    this.#checkReady()
    try {
      const content = await fs.promises.readFile(this.filePath, "utf-8")
      const contentParsed = JSON.parse(content)
      return contentParsed
    } catch (error) {
      console.error("Error leer archivo: " + error)
    }
  }

  async writeFile(productToSave) {
    this.#checkReady()
    console.log('productToSave:  ',productToSave)
    try {
      return await fs.promises.writeFile(this.filePath, productToSave)
    } catch (error) {
      console.error("Error escribir archivo: " + error)
    }
  }

  async getIndex(id) {
    this.#checkReady()
    const fileContent = await this.readFile()
    return await fileContent.find((item) => item.id === parseInt(id))
  }

}
