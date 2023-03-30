const UserService = require("../services/users.service.js")
const CartsService = require("../services/carts.service.js")
const bCrypt = require('bcrypt')
const { generateToken } = require('../utils/generateToken')

class UsersController {  
    constructor(){
        this.users = new UserService()
        this.carts = new CartsService()
      }

       
    getAllUsers = async (req, res) => {
        const usuarios = await this.users.getAllUsers()
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)

        const usuario = await this.users.getUserByUsername(username)
        const userId = usuario._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(usuarios.error) return res.status(400).json({msg: 'No hay usuarios cargados!'}) 
            res.render('addNewUser', { usuarios, username, userInfo, cart, expires })
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - getAllUsers',
                error: error
            })
        }
    }


    getUserById = async (req, res) => {
        const { id } = req.params
        let username = res.locals.username
        let userInfo = res.locals.userInfo
        const usuario = await this.users.getUserById(id)

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)

        const userId = usuario._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(!usuario) return res.status(404).json({msg: 'Usuario no encontrado'})
            
            res.render('userDetails', { usuario, username, userInfo, cart, expires })
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - getUserById',
                error: error
            })
        }
    }

    getUserByUsername = async (req, res) => {
        const { username } = req.params
        
        const usuario = await this.users.getUserByUsername(username)
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)
        
        const userId = usuario._id // User Id
        let cart = await this.carts.getCartByUserId(userId)
        
        try {
            if(!usuario) return res.status(404).json({msg: 'Usuario no encontrado'})
            
            res.render('userDetails', { usuario, username, userInfo, cart, expires })
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - getUserByusername',
                error: error
            })
        }
    }

    getUserByUsernameAndPassword = async (req, res) => {
        const { username } = req.params
        const { password } = req.body
        const usuario = await this.users.getUserByUsernameAndPassword(username, password)
        try {
            if(!usuario) return res.status(404).json({msg: 'Username desconocido o password incorrecto!!'})
            res.status(200).json({ Data: usuario })
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - getUserByUsername',
                error: error
            })
        }
    }

    createNewUser = async (req, res) => {
        const usuario = await this.users.addNewUser(req.body)
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)

        const usuarioLog = await this.users.getUserByUsername(username)
        const userId = usuarioLog._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(!usuarioLog) {
                res.render('addNewUser', { usuario, username, userInfo, cart, expires }) //agergar control
            }
            else {
                res.render('userDetails', { usuario, username, userInfo, cart, expires })
            } 
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - createNewUser',
                error: error
            })
        }
    }

    updateUser = async (req, res) => {
        let username = res.locals.username
        let userInfo = res.locals.userInfo
        const userToUpdate = req.body

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)

        const usuarioLog = await this.users.getUserByUsername(username)
        const userId = usuarioLog._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            const userUpdated = await this.users.updateUser(userToUpdate.id, userToUpdate)
            const usuario = await this.users.getUserById(userToUpdate.id)
            res.render('userDetails', { usuario, userUpdated, username, userInfo, cart, expires })
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })
        }
    }

    deleteUserById = async (req, res) => {
        const { id } = req.params
        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const cookie = req.session.cookie
        const time = cookie.expires
        const expires = new Date(time)

        const usuarioLog = await this.users.getUserByUsername(username)
        const userId = usuarioLog._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            const userDeleted = await this.users.deleteUserById(id)
            res.render('addNewUser', { usuarios, username, userInfo, cart, expires })
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })
        }
    }


    login = async (req, res) => {
        const { username, password, sessionStarted } = req.body
        let visits = req.session.visits

        const cookie = req.session.cookie
        const time = cookie.expires
        let expires = new Date(time)
        
        if (sessionStarted) {
            req.session.cookie.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            expires = req.session.cookie.expires
        }

        let boolean = false
        try {
            const user = await this.users.getUserByUsername(username)

                function isValidPassword(user, password) {
                    const bCrypto = bCrypt.compareSync(password, user.password)
                    return bCrypto
                }
            
            boolean = isValidPassword(user, password)
            
            if (boolean) {
                const usuario = await this.users.getUserByUsernameAndPassword(username, user.password)
                const userInfo = await this.users.getUserByUsername(username)
                
                if (!usuario) {
                    return res.render('register', { flag: false, fail: false }) 
                }
                else if (usuario && userInfo.status ) {
                    const access_token = generateToken(usuario)
                    const cart = await this.carts.getCartByUserId(userInfo._id)
                   
                    req.session.admin = true
                    req.session.username = userInfo.username    
                    return res.render('index', { userInfo, username, visits, cart, expires })
                }
                else {
                    return res.render('notAuthorizated', { userInfo, username, visits, expires })
                }
            
            } else {
                const flag = true
                const fail = true
                return res.render('login', { flag, fail } )
            }
    
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })
        }
     }

    // -------------- registra un nuevo usuario ------------------------------
    registerNewUser = async (req, res) => { 
        
        const yaExiste = await this.users.getUserByUsername(req.body.username) 
        const usuario = await this.users.registerNewUser(req.body)
    
        try {
            if (yaExiste) {
                const username = yaExiste.username
                return res.render('register', { username , flag: true,  fail: true})
            }
           
            const username = usuario.username
            res.render('login', { username, flag: true, fail: false })
       
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - RegisterNewUser',
                error: error
            })
        }
    }
}

module.exports = { UsersController }