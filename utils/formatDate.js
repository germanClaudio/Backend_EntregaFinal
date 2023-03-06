const date = require('date-and-time')

const dayNow = new Date();
const now = date.format(dayNow, 'DD-MM-YYYY_HH.mm.ss')

module.exports = 
    now