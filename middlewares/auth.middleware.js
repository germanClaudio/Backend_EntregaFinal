const authMiddleware = (req, res, next) => {
    
    const flag = true
    if (!req.session?.username || !req.session?.admin) {
        
        return res.render('index', { userInfo, username, visits, flag })
    } 
    next()
}

module.exports = { 
    authMiddleware
}