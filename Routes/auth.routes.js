const { Router } = require('express')
const authRouter = Router()

const passport = require('passport')
const { countVisits } = require('../middlewares/countVisits/countVisits.middleware')
const { checkAuthentication } = require('../middlewares/chekAuthentication')
const { authUserMiddleware } = require('../middlewares/authUser.middleware.js')

const { sessionPostLogin } = require('../controllers/session.controllers.js')

const { generateToken } = require('../utils/generateToken')

const GetUsers = require('../controllers/usuarios.controller.js')
const getUsers = GetUsers.UsersController
const users = new getUsers()

const serverMongoDB = require('../usuarios/userMongoDB')
const constructor = serverMongoDB.ServerMongoDB
const server = new constructor()

const GetCarts = require('../daos/carritos/CarritosDaoMongoDB.js')
const carts = new GetCarts()

//_______________________________ login _____________________________________ //
authRouter.get('/login', (req, res) => { // lleva la vista del formulario de login
    const flag = false
    const fail = false
    res.render('login', { flag, fail })
})


authRouter.post('/login', sessionPostLogin, countVisits, users.login)

//----------------------------------------------------------------
authRouter.get('/historial', checkAuthentication, authUserMiddleware, async (req, res) => {
    
    let username = res.locals.username
    let userInfo = res.locals.userInfo

    const cookie = req.session.cookie
    const time = cookie.expires
    const expires = new Date(time)
    
    try {
        const visits = req.session.visits
        const user = await server.getUserByUsername(username)
        const cart = await carts.getCartByUserId(user._id) 
        const { flag, fail } = true
        
        if (!user) {
            return res.render('register', { flag, fail })
        } else if ( user.status ) {
            const access_token = generateToken(user)
            req.session.admin = true
            req.session.username = userInfo.username
            return res.render('historial', { userInfo, username, cart, expires })
        } else {
            return res.render('notAuthorizated', { userInfo, username, visits, flag})
        }
        
    } catch (error) {
        res.status(500).send(error)
    }
})

authRouter.get('/index', checkAuthentication, authUserMiddleware ,async (req, res) => {
   
    let username = res.locals.username
    let userInfo = res.locals.userInfo

    const cookie = req.session.cookie
    const time = cookie.expires
    const expires = new Date(time)
    
    try {
        const visits = req.session.visits
        const user = await server.getUserByUsername(username)
        const cart = await carts.getCartByUserId(user._id)
        const { flag, fail } = true

        if (!user) {
            return res.render('register', { flag, fail })
        } else if ( user.status ) {
            const access_token = generateToken(user)
            const fail = false
            req.session.admin = true
            req.session.username = userInfo.username
            return res.render('index', { userInfo, username, visits, flag, fail, cart, expires })
        } else {
            return res.render('notAuthorizated', { userInfo, username, visits, flag, expires})
        }
         
    } catch (error) {
        res.status(500).send(error)
    }
})

//_________________________________ github _____________________________________ //

authRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}))

authRouter.get('/githubcallback', checkAuthentication, authUserMiddleware, passport.authenticate('github', {

        failureRedirect: '/api/auth/login'
        }), async (req, res) => {
            const username = req.user.username
            //let username = res.locals.username
            let userInfo = res.locals.userInfo

            const visits = req.session.visits
            const user = await server.getUserByUsername(username)
            const cart = await carts.getCartByUserId(user._id)
            const { flag, fail } = true
            
            req.session.admin = true

            const cookie = req.session.cookie
            const time = cookie.expires
            const expires = new Date(time)
           
            if (username != null) {
                const fail = false
                res.render('index', { username, userInfo, visits, flag, fail, cart, expires } )
            }
            if (username == null) {
                res.redirect('/api/login')
            }
        });

//_________________________________ register _____________________________ //

authRouter.get('/register', (req, res) => {   // devuelve la vista de registro
    const flag = false
    const fail = false
    res.render('register', { flag, fail })
})

authRouter.post('/register', users.registerNewUser)

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