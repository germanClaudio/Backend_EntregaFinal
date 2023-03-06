
const sessionGet = async (req, res) => {
    try {
        req.session.visitas = req.session.visitas ? req.session.visitas + 1 : 1
        res.send(`<h1>Bienvenido ${req.session.username}</h1> <h2>Visitas: ${req.session.visitas}</h2>`)        
    } catch (error) {
        return res.status(500).json({
            msg: error.message,
            success: false
        })
    }
}

const sessionLogout = (req, res) => {
    req.session.destroy(err =>{
        if(err) return res.send(err)
        res.send('<h1>Sesion cerrada Adeu</h1>')
    })
}

const sessionPostLogin = (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
      return res.send('<h1>login failed</h1>')
    }
    res.locals.username = username
    res.locals.admin = true
    
    next()
   }

module.exports = { 
    sessionGet ,
    sessionLogout,
    sessionPostLogin
}
