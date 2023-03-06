
// const options = require('../options/config')
const productos = []     //options.options.filePath.path

class ContenedorMemoria {

    constructor() {
        this.elementos = productos
    }
    
    getAllProducts() {
        return [...this.elementos]
    }

    getProductById(id) {
        const elem = this.elementos.find(elem => elem.id == id)
        if (!elem) {
            throw new Error(`Error al listar: elemento no encontrado`)
        } else {
            return elem
        }
    }

    createProduct(elem) {
        let newId
        if (this.elementos.length === 0) {
            newId = 1
        } else {
            newId = this.elementos[this.elementos.length - 1].id + 1
        }

        const newElem = { ...elem, id: newId }
        this.elementos.push(newElem)
        return newElem
    }

    updateProduct(elem) {
        elem.id = Number(elem.id)
        const index = this.elementos.findIndex(p => p.id === elem.id)
        if (index == -1) {
            throw new Error(`Error al actualizar: elemento no encontrado`)
        } else {
            this.elementos[index] = elem
            return elem
        }
    }

    deleteProduct(id) {
        const index = this.elementos.findIndex(elem => elem.id === id)
        if (index == -1) {
            throw new Error(`Error al borrar: elemento no encontrado`)
        } else {
            return this.elementos.splice(index, 1)
        }
    }

    deleteAllProduct() {
        this.elementos = []
    }
}

module.exports = ContenedorMemoria
