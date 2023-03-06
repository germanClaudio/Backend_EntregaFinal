const { Router } = require('express')
const routerProductos = Router()
const { authMiddleware } = require('../middlewares/auth.middleware.js')
const { checkAuthentication } = require('../middlewares/chekAuthentication.js')
const { authUserMiddleware, authProductMiddleware } = require('../middlewares/authUser.middleware.js')

const GetProducts = require('../controllers/productos.controller.js')
const getProducts = GetProducts.ProductsController
const products = new getProducts()

// -------------------  Seleccionar todos los Producto ------------------
routerProductos.get('/', checkAuthentication, authUserMiddleware, products.getAllProducts)

// -------------------  Seleccionar Producto por Id ------------------ 
routerProductos.get('/:id', checkAuthentication, authProductMiddleware, products.getProductById)

// -------------------  Ver detalles del Producto por Id ------------------ 
routerProductos.get('/select/:id', checkAuthentication, authProductMiddleware, products.selectProductById)

// -------------------  Crear Nuevo Producto ------------------------ 
routerProductos.post('/', checkAuthentication, authProductMiddleware, products.createNewProduct)

// -------------------  Actualizar Producto por Id ------------------ 
routerProductos.post('/update/:id', checkAuthentication, authProductMiddleware, products.updateProduct)

// -------------------  Eliminar Producto por Id ------------------ 
routerProductos.get('/delete/:id', checkAuthentication, authProductMiddleware, products.deleteProductById)

module.exports = routerProductos