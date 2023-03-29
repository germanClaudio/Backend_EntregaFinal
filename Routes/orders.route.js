const { Router } = require('express')
const routerOrders = Router()
const { checkAuthentication } = require('../middlewares/chekAuthentication')
const { authUserMiddleware } = require('../middlewares/authUser.middleware.js')

const GetCarts = require('../controllers/cart.controller')
const getCarts = GetCarts.CartsController
const carts = new getCarts()

const GetOrders = require('../controllers/orders.controller')
const getOrders = GetOrders.OrdersController
const orders = new getOrders()

// -------------------  Select a Cart By Id ------------------ 
//routerOrders.get('/:id', checkAuthentication, authUserMiddleware, orders.getCart) 

// -------------------  Add Product to Cart ------------------ 
//routerOrders.post('/add/:id', checkAuthentication, authUserMiddleware, orders.addItemToCart)

// -------------------  Add quantity of a Product to the Cart --------------- 
//routerOrders.post('/addQty/:id', checkAuthentication, authUserMiddleware, orders.addQtyToCart)

// -------------------  Removes quantity of a Product of the Cart ------------------ 
//routerOrders.post('/remove/:id', checkAuthentication, authUserMiddleware, orders.removeItemFromCart)

// -------------------  Removes all items from one Product of the Cart ------------------ 
//routerOrders.post('/deleteItem/:id', checkAuthentication, authUserMiddleware, orders.deleteItemFromCart)

// -------------------  Empty the Cart ------------------ 
//routerOrders.get('/empty-cart/:id', checkAuthentication, authUserMiddleware, orders.emptyCart)

// -------------------  Generate Purcharse Order of the Cart ------------------ 
//routerOrders.get('/genOrder/:id', checkAuthentication, authUserMiddleware, orders.genOrderCart)

// -------------------  Get All Orders List ------------------ 
//routerOrders.get('/', checkAuthentication, authUserMiddleware, orders.getAllOrders)

module.exports = routerOrders