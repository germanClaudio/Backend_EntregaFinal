const MessagesService = require("../services/messages.service.js")
const ProductosService = require("../services/products.service.js")
const CartsService = require("../services/carts.service.js")
const UserService = require("../services/users.service.js")

function formatDate(date) {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const hours = date.getHours()
    const min = date.getMinutes()
    const sec = date.getSeconds()
    
    return day + "-" + month + "-" + year + "_" + hours + "." + min + "." + sec
}

class MessagesController {  
    constructor(){
        this.products = new ProductosService()
        this.carts = new CartsService()
        this.users = new UserService()
        this.messages = new MessagesService()
    }

    getAllMessages = async (req, res) => {
        const mensajes = await this.messages.getAllMessages()
        
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(mensajes.error) return res.status(400).json({msg: 'No hay mensajes cargados'}) 
            
            res.render('addNewMessage', { mensajes, username, userInfo, cart })
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - getAllProducts',
                error: error
            })
        }
    }

    getMessageById = async (req, res) => {
        const { id } = req.params
        const mensaje = await this.messages.getMessageById(id)
        
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(!mensaje) return res.status(404).json({msg: 'Mensaje no encontrado'})
            
            res.render('addNewMessage', { mensaje, username, userInfo, cart })
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - getProductById',
                error: error
            })
        }
    }

    createNewMessage = async (req, res) => {
        
        const messageStructure = {
            author: {
                email: req.body.email,
                name: req.body.name,
                lastName: req.body.lastName,
                alias: req.body.alias,
                avatar: req.body.avatar,
            },
            text: req.body.text,
            date: formatDate(new Date()),
            status: true,
        }  
        
        const mensaje = await this.messages.createNewMessage(messageStructure)
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(!mensaje) return res.status(404).json({Msg: 'Mensaje no guardado'})
            res.render('addNewMessage', { mensaje, username, userInfo, cart })
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - createNewProducts',
                error: error
            })
        }
    }

    deleteMessageById = async (req, res) => {
        const { id } = req.params
        
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            const messageDeleted = await this.messages.deleteMessageById(req.params.id)
            res.render('addNewMessage', { messageDeleted, username, userInfo, cart })
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })
        }
    }

    deleteAllMessages = async (req, res) => {
        try {
            //const deleted = await this.products.deleteAllProducts()
            const deleted = await this.messages.deleteAllMessages()
            res.status(200).json(deleted)
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })    
        }
    }
}

module.exports = { MessagesController }