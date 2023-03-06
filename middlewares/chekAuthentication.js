const ContainerUsers = require('../daos/usuarios/UsuariosDaoFactory.js')
const containerUser = ContainerUsers.getDaoUsers()

const checkAuthentication = async (req, res, next) => {
    
    if (req.isAuthenticated()) {
        return res.redirect("/api/auth/login")
    }
    res.locals.username = req.session.username
    res.locals.userInfo = await containerUser.getUserByUsername(req.session.username)
    next();
}

module.exports = { checkAuthentication }