const { Router } = require('express')
const routerCarts = Router()
const { checkAuthentication } = require('../middlewares/chekAuthentication')
const { authUserMiddleware } = require('../middlewares/authUser.middleware.js')

const GetCarts = require('../controllers/cart.controller')
const getCarts = GetCarts.CartsController
const carts = new getCarts()

// -------------------  Select a Cart By Id ------------------ 
routerCarts.get('/:id', checkAuthentication, authUserMiddleware, carts.getCart) 

// -------------------  Add Product to Cart ------------------ 
routerCarts.post('/add/:id', checkAuthentication, authUserMiddleware, carts.addItemToCart)

// -------------------  Add quantity of a Product to the Cart --------------- 
routerCarts.post('/addQty/:id', checkAuthentication, authUserMiddleware, carts.addQtyToCart)

// -------------------  Removes quantity of a Product of the Cart ------------------ 
routerCarts.post('/remove/:id', checkAuthentication, authUserMiddleware, carts.removeItemFromCart)

// -------------------  Removes all items from one Product of the Cart ------------------ 
routerCarts.post('/deleteItem/:id', checkAuthentication, authUserMiddleware, carts.deleteItemFromCart)

// -------------------  Empty the Cart ------------------ 
routerCarts.get('/empty-cart/:id', checkAuthentication, authUserMiddleware, carts.emptyCart)

// -------------------  Generate Purcharse Order of the Cart ------------------ 
routerCarts.get('/genOrder/:id', checkAuthentication, authUserMiddleware, carts.genOrderCart)

// -------------------  Get All Orders List ------------------ 
routerCarts.get('/', checkAuthentication, authUserMiddleware, carts.getAllOrders)

module.exports = routerCarts