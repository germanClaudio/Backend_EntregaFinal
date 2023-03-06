const CarritosDaoFactory = require('../daos/carritos/CarritosDaoFactory.js')
const carritosDao = CarritosDaoFactory.getDaoCart()

class CartService {
    constructor() {
        this.carritos = carritosDao
    }

    // returns all products from one Cart
    async getArrProducts(data) {
        return this.carritos.getArrProducts(data)
    }

    // reduce quantity of all products from one Cart when shopping is done
    async reduceStockProduct(data) {
        return this.carritos.reduceStockProduct(data)
    }

    // returns a cart by Id
    async getCart(id) {
        return this.carritos.getCart(id)
    }

    // returns all product from a Cart
    async getCartByUserId(id) {
        return this.carritos.getCartByUserId(id)
    }
    
    // add new product to a cart
    async addItemToCart(payload) {
        return this.carritos.addItemToCart(payload)
    }
    
    // remove one product from cart
     async removeItemFromCart(payload) {
        return this.carritos.removeItemFromCart(payload)
    }

    // remove one item from cart
    async deleteItemFromCart(id) {
        return this.carritos.deleteItemFromCart()
    }
    
    // Empty cart by Id
    async emptyCart(id) {
        return this.carritos.emptyCart(id)
    }

    // Generate Order Cart
    async genOrderCart(id, invoice) {
        return this.carritos.genOrderCart(id, invoice)
    }

    // returns all Orders
    async getAllOrders() {
        return this.carritos.getAllOrders()
    }

}

module.exports = CartService
