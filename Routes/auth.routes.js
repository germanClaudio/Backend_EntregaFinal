const { Router } = require('express')
const authRouter = Router()

const passport = require('passport')
const { countVisits } = require('../middlewares/countVisits/countVisits.middleware')
const { checkAuthentication } = require('../middlewares/chekAuthentication')
const { authUserMiddleware, authProductMiddleware } = require('../middlewares/authUser.middleware.js')

const { sessionPostLogin } = require('../controllers/session.controllers.js')

//const authMiddleware = require('../middlewares/auth.middleware')
const { generateToken } = require('../utils/generateToken')
const logger = require('../utils/winston')

const serverMongoDB = require('../usuarios/userMongoDB')  //../daos/usuarios/UsuariosDaoMongoDB.js
const constructor = serverMongoDB.ServerMongoDB
const server = new constructor()

// const GetUsers = require('../controllers/usuarios.controller.js')
// const getUsers = GetUsers.UsersController
// const users = new getUsers()

const GetCarts = require('../daos/carritos/CarritosDaoMongoDB.js')
const carts = new GetCarts()

const bCrypt = require('bcrypt');

//_______________________________ login _____________________________________ //
authRouter.get('/login', (req, res) => { // lleva la vista del formulario de login
    const flag = false
    const fail = false
    res.render('login', { flag, fail })
})


authRouter.post('/login', sessionPostLogin, countVisits, async (req, res) => { 
    try {
        const { username, password } = req.body
        let visits = req.session.visits
        const { flag, fail } = true
                
        const user = await server.getUserByUsername(username)
        const cart = await carts.getCartByUserId(user._id)
        
        function isValidPassword(user, password) {
            const bCrypto = bCrypt.compareSync(password, user.password)
            return bCrypto
           }

        const boolean = isValidPassword(user, password)
        if (boolean) {
            const usuario = await server.getUserByUsernameAndPassword(username, user.password)
            const userInfo = await server.getUserByUsername(username)
                                    
            if (!usuario) {
                return res.render('register', { flag })
            
            } else if (usuario && userInfo.status ) {
                const access_token = generateToken(usuario)
                const fail = false
                req.session.admin = true
                req.session.username = userInfo.username
                
                return res.render('index', { userInfo, username, visits, flag, fail, cart })
                
            } else {
                return res.render('notAuthorizated', { userInfo, username, visits, flag, cart})
            }

        } else {
            const flag = false
            const fail = true
            return res.render('login', { flag, fail } )
        }

    } catch (error) {
        const flag = false
        const fail = true
        return res.render('login', { flag, fail } )
    }
 })

//----------------------------------------------------------------
authRouter.get('/historial', checkAuthentication, authUserMiddleware, async (req, res) => {
    
    let username = res.locals.username
    let userInfo = res.locals.userInfo
    
    try {
        const visits = req.session.visits
        const user = await server.getUserByUsername(username)
        const cart = await carts.getCartByUserId(user._id)
        const { flag, fail } = true
        
        if (!user) {
            return res.render('register', { flag })
        } else if ( user.status ) {
            const access_token = generateToken(user)
            //const fail = false
            req.session.admin = true
            req.session.username = userInfo.username
            //return res.render('index', { userInfo, username, visits, flag, fail, cart })
            return res.render('historial', { userInfo, username, cart })
        } else {
            return res.render('notAuthorizated', { userInfo, username, visits, flag, cart})
        }
        
    } catch (error) {
        res.status(500).send(error)
    }
})

authRouter.get('/index', checkAuthentication, authUserMiddleware ,async (req, res) => {
   
    let username = res.locals.username
    let userInfo = res.locals.userInfo

    try {
        const visits = req.session.visits
        const user = await server.getUserByUsername(username)
        const cart = await carts.getCartByUserId(user._id)
        const { flag, fail } = true

        if (!user) {
            return res.render('register', { flag })
        } else if ( user.status ) {
            const access_token = generateToken(user)
            const fail = false
            req.session.admin = true
            req.session.username = userInfo.username
            return res.render('index', { userInfo, username, visits, flag, fail, cart })
        } else {
            return res.render('notAuthorizated', { userInfo, username, visits, flag, cart})
        }
         
    } catch (error) {
        res.status(500).send(error)
    }
})

//_________________________________ github _____________________________________ //

authRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}))

authRouter.get('/githubcallback', passport.authenticate('github', { 
//     successRedirect: '/api/productos',
//     failureRedirect: '/api/auth/login'
// })),
        failureRedirect: '/api/auth/login'
        }), (req, res) => {
            const username = req.user.username
            if (username != null) {
                res.render('index', { username } )
            }
            if (username == null) {
                res.redirect('/api/login');
            }
        });

//_________________________________ register _____________________________ //

authRouter.get('/register', (req, res) => {   // devuelve la vista de registro
    const flag = false
    res.render('register', { flag })
})
    // authRouter.post('/register', passport.authenticate('signup', {
    //     successRedirect: '/api/auth/login',
    //     failureRedirect: '/api/auth/register',
    // }))

authRouter.post('/register', checkAuthentication, server.createUser) //probar

//____________________________ logout __________________________________ //

authRouter.get('/logout', checkAuthentication, authUserMiddleware, async (req, res) => { // cierra la sesion
    
    let username = res.locals.username
    let userInfo = res.locals.userInfo

    req.session.destroy(err => {
        if(err) return res.send(err)
        try {
            return res.render('logout', { username, userInfo })
        } catch(err) {
            return res.json(err)
        }
    })
})

module.exports = { 
    authRouter 
}