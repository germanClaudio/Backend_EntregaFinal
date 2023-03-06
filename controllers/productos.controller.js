const ProductosService = require("../services/products.service.js")
const CartsService = require("../services/carts.service.js")
const UserService = require("../services/users.service.js")


class ProductsController {  
    constructor(){
        this.products = new ProductosService()
        this.carts = new CartsService()
        this.users = new UserService()
    }

    getAllProducts = async (req, res) => {
        const productos = await this.products.getAllProducts()
        
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(productos.error) return res.status(400).json({msg: 'No hay productos cargados'}) 
            
            res.render('addNewProducts', { productos, username, userInfo, cart })
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - getAllProducts',
                error: error
            })
        }
    }

    getProductById = async (req, res) => {
        const { id } = req.params
        const producto = await this.products.getProductById(id)
        
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(!producto) return res.status(404).json({msg: 'Producto no encontrado'})
            
            res.render('productDetails', { producto, username, userInfo, cart })
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - getProductById',
                error: error
            })
        }
    }

    selectProductById = async (req, res) => {
        const { id } = req.params
        const producto = await this.products.selectProductById(id)
        
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(!producto) return res.status(404).json({msg: 'Producto no encontrado'})
            res.render('itemDetails', { producto, username, userInfo, cart })
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - getProductById',
                error: error
            })
        }
    }

    createNewProduct = async (req, res) => {
        const producto = await this.products.addProduct(req.body)
        
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(!producto) return res.status(404).json({Msg: 'Producto no guardado'})
            res.render('addNewProducts', { producto, username, userInfo, cart })
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - createNewProducts',
                error: error
            })
        }
    }

    updateProduct = async (req, res) => {
        const id = req.params.id
        const producto = req.body
            
        let username = res.locals.username
        let userInfo = res.locals.userInfo
        
        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            const productUpdated = await this.products.updateProduct(id, producto)
            res.render('addNewProducts', { productUpdated, username, userInfo, cart})
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })
        }
    }

    deleteProductById = async (req, res) => {
        const { id } = req.params
        console.log(id)
        
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            const productDeleted = await this.products.deleteProductById(req.params.id)
            res.render('addNewProducts', { productDeleted, username, userInfo, cart })
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })
        }
    }

    deleteAllProducts = async (req, res) => {
        try {
            const deleted = await this.products.deleteAllProducts()
            res.status(200).json(deleted)
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })    
        }
    }
}

module.exports = { ProductsController }