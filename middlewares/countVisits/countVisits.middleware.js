const logger = require('../../utils/winston')

const countVisits = (req, res, next) => {
    logger.info('Count visits')
    req.session.visits = req.session.visits ? req.session.visits + 1 : 1
    req.session.username = req.body.username
    next()
}
module.exports = {
    countVisits
}
