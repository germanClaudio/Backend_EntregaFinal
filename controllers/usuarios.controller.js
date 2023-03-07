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

        const usuario = await this.users.getUserByUsername(username)
        const userId = usuario._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(usuarios.error) return res.status(400).json({msg: 'No hay usuarios cargados!'}) 
            res.render('addNewUser', { usuarios, username, userInfo, cart })
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

        const userId = usuario._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(!usuario) return res.status(404).json({msg: 'Usuario no encontrado'})
            
            res.render('userDetails', { usuario, username, userInfo, cart })
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

        const userId = usuario._id // User Id
        let cart = await this.carts.getCartByUserId(userId)
        
        try {
            if(!usuario) return res.status(404).json({msg: 'Usuario no encontrado'})
            
            res.render('userDetails', { usuario, username, userInfo, cart })
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

        const usuarioLog = await this.users.getUserByUsername(username)
        const userId = usuarioLog._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            if(!usuarioLog) {
                res.render('login', { usuario, username, userInfo })
            }
            else {
                res.render('userDetails', { usuario, username, userInfo, cart })
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

        const usuarioLog = await this.users.getUserByUsername(username)
        const userId = usuarioLog._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            const userUpdated = await this.users.updateUser(userToUpdate.id, userToUpdate)
            const usuario = await this.users.getUserById(userToUpdate.id)
            res.render('userDetails', { usuario, userUpdated, username, userInfo, cart })
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

        const usuarioLog = await this.users.getUserByUsername(username)
        const userId = usuarioLog._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        try {
            const userDeleted = await this.users.deleteUserById(id)
            res.render('addNewUser', { usuarios, username, userInfo, cart })
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error
            })
        }
    }

    login = async (req, res) => {
        try {
            const { username, password } = req.body
            let visits = req.session.visits
            
            const { flag, fail } = true
            const user = await this.users.getUserByUsername(username)
            const cart = await this.carts.getCartByUserId(user._id)
            
            function isValidPassword(user, password) {
                const bCrypto = bCrypt.compareSync(password, user.password)
                return bCrypto
            }
    
            const boolean = isValidPassword(user, password)
               
            if (boolean) {
                const usuario = await this.users.getUserByUsernameAndPassword(username, user.password)
                const userInfo = await this.users.getUserByUsername(username)

                if (!usuario) {
                    return res.render('register', { flag })

                }
                else if (usuario && userInfo.status ) {
                const access_token = generateToken(usuario)
            
                req.session.admin = true
                req.session.username = userInfo.username
                
                return res.render('index', { userInfo, username, visits, cart })
                
                } else {
                    return res.render('notAuthorizated', { userInfo, username, visits, cart })
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

    // -------------- registra un usuario ------------------------------
    registerNewUser = async (req, res) => { 
        const { name, lastName, email, avatar, username, status, admin } = req.body
        let { password } = req.body
    
        function createHash(password) {
            return bCrypt.hashSync(
                      password,
                      bCrypt.genSaltSync(10),
                      null);
        }
        
        password = createHash(password)
    
        const yaExiste = await this.users.getUserByUsername(username) 
    
        if (yaExiste) {
            return res.render('register', { username , flag: true,  fail: true})
        } else {
            const nuevoUsuario = { 
                name,
                lastName,
                email,
                username,
                avatar,
                password,
                status,
                admin
            }
            
            //------------------------------
            this.users.registerNewUser(nuevoUsuario)
            //------------------------------
            const access_token = generateToken({
                username,        
                admin,         
            })
            res.render('login', { username: nuevoUsuario.username, flag: true, fail: false })

        }
     }
}

module.exports = { UsersController }