const { asDto } = require('../../dto/productosDto.js')

module.exports = class ProductosDaoMemoria {

    constructor() {
        this.productos = []
    }

    init() {
        console.log('Productos dao en memoria -> listo')
    }

    disconnect() {
        console.log('Productos dao en memoria -> cerrado')
    }

    #getIndex(id) {
        return this.productos.findIndex(producto => producto.id === id)
    }

    getAllProducts() {
        return asDto(this.productos)
    }

    getProductById(idBuscado) {
        return asDto(this.productos[ this.#getIndex(idBuscado) ])
    }

    createProduct(productoNuevo) {
        this.productos.push(productoNuevo)
        return asDto(productoNuevo)
    }

    deleteProduct(idParaBorrar) {
        const [ borrada ] = this.productos.splice(this.#getIndex(idParaBorrar), 1)
        return asDto(borrada)
    }

    deleteAllProduct() {
        this.productos = []
    }

    updateProduct(idParaReemplazar, productoNuevo) {
        const index = this.#getIndex(idParaReemplazar)
        const actualizada = { ...this.productos[ index ], ...productoNuevo }
        this.productos.splice(index, 1, actualizada)
        return asDto(actualizada)
    }
}
