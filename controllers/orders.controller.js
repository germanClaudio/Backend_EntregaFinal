const CartsService = require("../services/carts.service.js")
const OrdersService = require("../services/orders.service.js")
const ProductsService = require("../services/products.service.js")
const UserService = require("../services/users.service.js")
const logger = require('../utils/winston.js')
const now = require('../utils/formatDate.js')

class OrdersController {  
    constructor(){
        this.orders = new OrdersService()
        this.carts = new CartsService()
        this.products = new ProductsService()
        this.users = new UserService()
    }

    // ---------------- Get All products from one Cart ---------------
    getArrProducts = async (req, res) => {
        try {
            return arrProducts
        }
        catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })
        }    
    }

    // ------- reduce stock products when PO is generated ---------------
    reduceStockProduct = async (req, res) => {
        try {
            return arrStockProduct
        }
        catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })
        }    
    }

    // ---------------- Get Cart by Id ---------------
    getCart = async (req, res) => {
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)

        const usuarios = await this.users.getUserByUsername(username)

        try {
            const { id } = req.params
            const cart = await this.carts.getCart(id)
            const data = await this.carts.getCart(id)
            const arrProducts = await this.carts.getArrProducts(data)

            res.render('cartDetails', { cart, usuarios, username, userInfo, data, arrProducts, expires })
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })
        }
    }
    
// -------------------  Add Product to Cart ---------------
    addItemToCart = async (req, res) => {
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)
        
        try {
            const { productId } = req.body // Product Id
            const quantity = Number.parseInt(req.body.quantity)
            const usuarios = await this.users.getUserByUsername(username)
            const userId = usuarios._id // User Id
            
            let cart = await this.carts.getCartByUserId(userId)
            let productDetails = await this.products.getProductById(productId)
            
                 if (!productDetails) {
                return res.status(500).json({
                    type: "Not Found",
                    msg: "Invalid request"
                })
            }
            //--If Cart Exists ----
            if (cart) {
                //---- check if index product exists ----
                const indexFound = cart.items.findIndex(item => item.productId == productId)
                
            //----check if product exist, just add the previous quantity with the new quantity and update the total price---
                if (indexFound !== -1) {
                    cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity
                    cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price
                    cart.items[indexFound].price = productDetails.price
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next)
                    cart.modifiedOn = now
                }
            //----Check if Quantity is Greater than 0 then add item to items Array ----
                else if (quantity > 0) {
                    cart.items.push({
                        productId: productDetails.id,
                        name: productDetails.name,
                        quantity: quantity,
                        price: productDetails.price,
                        total: parseInt(productDetails.price * quantity)
                    })
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next)
                    cart.modifiedOn = now
                }
                //----if quantity of price is 0 throw the error -------
                else {
                    return res.status(400).json({
                        type: "Invalid",
                        msg: "Invalid request"
                    })
                }
                const data = await cart.save()
                const arrProducts = await this.carts.getArrProducts(data)
                res.render('cartDetails', { data, usuarios, username, userInfo, productDetails, cart, arrProducts, expires })
            }
        //- if there is no user with a cart...it creates a new cart and then adds the item to the cart that has been created-----
            else {
                const cartData = {
                    items: [{
                        productId: productDetails.id,
                        name: productDetails.name,
                        quantity: quantity,
                        total: parseInt(productDetails.price * quantity),
                        price: productDetails.price,
                        timestamp: now,
                    }],
                    subTotal: parseInt(productDetails.price * quantity),
                    userId: usuarios._id,
                    username: usuarios.username,
                    active: true,
                    modifiedOn: now,
                }
                
                let data = await this.carts.addItemToCart(cartData)
                const arrProducts = await this.carts.getArrProducts(data)
                res.render('cartDetails', { data, usuarios, username, userInfo, productDetails, cart, arrProducts, expires })
            }
        } catch (err) {
            res.status(400).json({
                type: "Invalid",
                msg: "Something Went Wrong adding product to Cart(created). Please try again",
                err: err
            })
        }
    }

    // -------  Add quantity of a Product to the Cart -----------
    addQtyToCart = async (req, res) => {
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)
        
        try {
            const { productId } = req.body // Product Id
            const quantity = Number.parseInt(req.body.quantity)
            const usuarios = await this.users.getUserByUsername(username)
            const userId = usuarios._id // User Id
            let cart = await this.carts.getCartByUserId(userId)
            let productDetails = await this.products.getProductById(productId)
            
                 if (!productDetails) {
                return res.status(500).json({
                    type: "Not Found",
                    msg: "Invalid request"
                })
            }
            //--If Cart Exists ----
            if (cart) {
                //---- check if index product exists ----
                const indexFound = cart.items.findIndex(item => item.productId == productId)
                
                //----check if product exist, just add the previous quantity with the new quantity and update the total price---
                if (indexFound !== -1 && quantity > 0) {
                    cart.items[indexFound].quantity = cart.items[indexFound].quantity + 1
                    cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price
                    cart.items[indexFound].price = productDetails.price
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next)
                    cart.modifiedOn = now
                }
                //----if quantity of price is 0 throw the error -------
                else {
                    return res.status(400).json({
                        type: "Invalid",
                        msg: "Invalid request"
                    })
                }
                const data = await cart.save()
                const arrProducts = await this.carts.getArrProducts(data)
                res.render('cartDetails', { data, usuarios, username, userInfo, productDetails, cart, arrProducts, expires })
            }
        } catch (err) {
            console.log(err)
            res.status(400).json({
                type: "Invalid",
                msg: "Something Went Wrong",
                err: err
            })
        }
    }

// ------------  Removes quantity of a Product of the Cart --------
    removeItemFromCart = async (req, res) => {
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)
        
        try {
            const { productId } = req.body
            const quantity = Number.parseInt(req.body.quantity)

            const usuarios = await this.users.getUserByUsername(username)
            const userId = usuarios._id // User Id

            let cart = await this.carts.getCartByUserId(userId)
            let productDetails = await this.products.getProductById(productId)
            
                 if (!productDetails) {
                return res.status(500).json({
                    type: "Product Not Found",
                    msg: "Invalid Product request"
                })
            }
            //--If Cart Exists ----
            if (cart) {
                //---- check if index exists ----
                const indexFound = cart.items.findIndex(item => item.productId == productId)
                //------this removes an item from the the cart if the quantity is set to zero.
                if (indexFound !== -1 && quantity === 1) {
                    cart.items.splice(indexFound, 1)
                    if (cart.items.length == 0) {
                        cart.subTotal = 0
                    } else {
                        cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next)
                    }
                }
                //----------check if product exist, just add the previous quantity with the new quantity and update the total price-------
                else if (indexFound !== -1 && quantity > 1) {
                    cart.items[indexFound].quantity = cart.items[indexFound].quantity - 1
                    cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price
                    cart.items[indexFound].price = productDetails.price
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next)
                    cart.modifiedOn = now
                }
                //----if quantity of price is 0 throw the error -------
                else {
                    return res.status(400).json({
                        type: "Invalid",
                        msg: "Invalid request"
                    })
                }
                const data = await cart.save()
                const arrProducts = await this.carts.getArrProducts(data)
                res.render('cartDetails', { data, usuarios, username, userInfo, productDetails, cart, arrProducts, expires })
            }
        } catch (err) {
            console.log(err)
            res.status(400).json({
                type: "Invalid",
                msg: "Something Went Wrong",
                err: err
            })
        }
    }

// -------  Removes all items from one Product of the Cart -------
    deleteItemFromCart = async (req, res) => {
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)
        
        try {
            const usuarios = await this.users.getUserByUsername(username)
            const userId = usuarios._id // User Id
            const { productId } = req.body // Product Id
            const quantity = 0
            let cart = await this.carts.getCartByUserId(userId)
            let productDetails = await this.products.getProductById(productId)
                
            if (!productDetails) {
                return res.status(500).json({
                    type: "Product Not Found",
                    msg: "Invalid request"
                })
            }
            //--If Cart Exists ----
            if (cart) {
                //---- check if index exists ----
                const indexFound = cart.items.findIndex(item => item.productId == productId)
                //------this removes an item from the the cart because the quantity is set to zero.
                if (indexFound !== -1 && quantity <= 0) {
                    cart.items.splice(indexFound, 1)
                    if (cart.items.length == 0) {
                        cart.subTotal = 0
                    } else {
                        cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next)
                    }
                }
                //----if quantity of price is 0 throw the error -------
                else {
                    return res.status(400).json({
                        type: "Invalid",
                        msg: "Invalid request"
                    })
                }
                const data = await cart.save()
                const arrProducts = await this.carts.getArrProducts(data)
                res.render('cartDetails', { data, usuarios, username, userInfo, productDetails, cart, arrProducts, expires })
            }
            
        } catch (err) {
            console.log(err)
            res.status(400).json({
                type: "Invalid",
                msg: "Something Went Wrong",
                err: err
            })
        }
    }

    // -----------  Empty the Cart ------------------
    emptyCart = async (req, res) => {
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)
        
        try {
            const { id } = req.params
            const usuarios = await this.users.getUserById(id)
           
            let cart = await this.carts.emptyCart(id)
            cart.items = [];
            cart.subTotal = 0
            let data = await cart.save()
           
            res.render('cartDetails', { data, usuarios, username, userInfo, cart, expires })
                    
        } catch (error) {
            res.status(400).json({
                type: "Invalid",
                msg: "Upss, Something Went Wrong",
                error: error
            })
        }
    }

    // --- Generate P.O. in pdf format, empty the Cart and send an text msg & email to Admin ------
    genOrderCart = async (req, res) => {
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)
        
        try {
            const { id } = req.params
            const usuarios = await this.users.getUserByUsername(username)
            let cart = await this.carts.getCart(id)

            if ( cart.items.length > 0 ) {
                const dateInvoice = now
                const invoiceNumber = (cart._id.toString()).concat('_',dateInvoice)
                
                const invoice = {
                    shipping: {
                        name: usuarios.name,
                        lastName: usuarios.lastName,
                        username: usuarios.username,
                        email: usuarios.email,
                    },
                    items: cart.items,
                    subTotal: cart.subTotal,
                    quantity: cart.items.length,
                    modifiedOn: dateInvoice,
                    invoice_nr: invoiceNumber,
                }
                
                const pathPdfFile = `./src/output/Invoice_${invoiceNumber}.pdf`
                const { createInvoice } = require('../utils/createInvoice.js')
                createInvoice(invoice, pathPdfFile)
                
                ////////////// phone text message to Administrator //////////////////////
                // const accountSid = process.env.TWILIO_ACCOUNTSID;
                // const authToken = process.env.TWILIO_AUTH_TOKEN;
                // const client = require("twilio")(accountSid, authToken)

                // ;(async () => {
                //     try {
                //         const message = await client.messages.create({
                //             body: `El usuario ${usuarios.name}, ${usuarios.lastName}, realizó la compra exitosamente!`,
                //             from: process.env.PHONE_SENDER, // '+14094496870',
                //             to: process.env.PHONE_RECEIVER
                //         })

                //     } catch (error) {
                //         logger.error(error)
                //     }
                // })()
                
                //////////////////// gmail to Administrator //////////////////////
                const { createTransport } = require('nodemailer')
                const TEST_EMAIL = process.env.TEST_EMAIL
                const PASS_EMAIL = process.env.PASS_EMAIL
    
                const transporter = createTransport({
                    service: 'gmail',
                    port: 587,
                    auth: {
                        user: TEST_EMAIL,
                        pass: PASS_EMAIL
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                })
    
                const mailOptions = {
                    from: 'Servidor NodeJS - Gmail - ACME Inc. Ecommerce',
                    to: TEST_EMAIL,
                    subject: `Generación O/C# ${invoice.invoice_nr} desde Node JS - Gmail - ACME Inc. Ecommerce`,
                    html: `<h3 style="color: green;">El usuario ${usuarios.name} ${usuarios.lastName}, realizó la compra exitosamente!</h3>`,
                    attachments: [
                        {
                            path: `./src/output/Invoice_${invoice.invoice_nr}.pdf`
                        }
                    ]
                }
    
                ;(async () => {
                    try {
                        const info = await transporter.sendMail(mailOptions)
                        logger.info(info)
                    } catch (err) {
                        logger.error(err)
                    }
                })()

                // ------------ Save order in DataBase ---------------
                const pathOrder = `src/output/Invoice_${invoice.invoice_nr}.pdf`
                const order = await this.carts.genOrderCart(cart, invoice)
                let orderGenerated = await order.save()
                
                // ------------ Reduce stock quantity -------------------
               await this.carts.reduceStockProduct(cart)

                // ------------ Empty the cart -------------------
                cart = await this.carts.emptyCart(id)
                    cart.items = [];
                    cart.subTotal = 0
                    let data = await cart.save()

                    res.render('orderGenerated', { data, usuarios, username, userInfo, cart, orderGenerated, pathOrder, expires })
            }
            else {
                return res.status(400).json({
                    type: "Invalid",
                    msg: "Invalid request generating Order"
                })
            }     
        }
        catch (error) {
            res.status(400).json({
                type: "Invalid_Operation",
                msg: "Upss, Something Went Wrong generating the PO, please try again",
                error: error
            })
        }
    }

     // ---------------- Gat All Orders ---------------
     getAllOrders = async (req, res) => {
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)

        try {
            const usuarios = await this.users.getUserByUsername(username)
            const userId = usuarios._id // User Id
            
            let cart = await this.carts.getCartByUserId(userId)
            
            const data = await this.carts.getCart(cart._id)
            const arrProducts = await this.carts.getArrProducts(data)
            const orders = await this.carts.getAllOrders()
            
            res.render('orders', { cart, usuarios, username, userInfo, data, orders, arrProducts, expires })
            
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })
        }
    }

}

module.exports = { OrdersController }