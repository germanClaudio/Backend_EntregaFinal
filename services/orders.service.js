const OrdenesDaoFactory = require('../daos/ordenes/OrdenesDaoFactory.js')
const ordenesDao = OrdenesDaoFactory.getDaoOrders()

class OrdersService {
    constructor() {
        this.ordenes = ordenesDao
    }

    // returns all products from one Cart
    async getArrProducts(data) {
        return this.ordenes.getArrProducts(data)
    }

    // reduce quantity of all products from one Cart when shopping is done
    async reduceStockProduct(data) {
        return this.ordenes.reduceStockProduct(data)
    }

    // returns a cart by Id
    async getCart(id) {
        return this.ordenes.getCart(id)
    }

    // returns all product from a Cart
    async getCartByUserId(id) {
        return this.ordenes.getCartByUserId(id)
    }
    
    // add new product to a cart
    async addItemToCart(payload) {
        return this.ordenes.addItemToCart(payload)
    }
    
    // remove one product from cart
     async removeItemFromCart(payload) {
        return this.ordenes.removeItemFromCart(payload)
    }

    // remove one item from cart
    async deleteItemFromCart(id) {
        return this.ordenes.deleteItemFromCart()
    }
    
    // Empty cart by Id
    async emptyCart(id) {
        return this.ordenes.emptyCart(id)
    }

    // Generate Order Cart
    async genOrderCart(id, invoice) {
        return this.ordenes.genOrderCart(id, invoice)
    }

    // returns all Orders
    async getAllOrders() {
        return this.ordenes.getAllOrders()
    }

}

module.exports = OrdersService
