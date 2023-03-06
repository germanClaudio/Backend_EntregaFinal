const ProductosService = require("../services/products.service.js")
const CartsService = require("../services/carts.service.js")
const UserService = require("../services/users.service.js")
const InfoService = require("../services/info.service.js")

const { fork } = require('child_process')
const path = require('path')
const logger = require('../utils/winston')

const parseArgs = require('minimist')
const options = require('../options/config')

class InfoController {  
    constructor(){
        this.info = new InfoService()
        this.products = new ProductosService()
        this.carts = new CartsService()
        this.users = new UserService()
      }
        
    getInfoSystem = async (req, res) => {
        const info = this.info

        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        const infoSystem = [
            {args: parseArgs(process.argv.slice(2))},
            {host: options.options.HOST},
            {direc: process.cwd()},
            {idProcess: process.pid},
            {nodeVersion: [{data: process.versions}]},
            {title: process.title},
            {os: process.platform},
            {memoryUse: [{data: process.memoryUsage()}]},
            {ruta: process.argv[1]},
            {port: process.env.PORT},
        ]

        try {

            if(info.error) return res.status(400).json({msg: 'No hay Informacion que mostrar!'}) 
             res.render('sistema', { infoSystem, username, userInfo, cart })
           
        } catch (error) {
            res.status(500).json({
                status: false,
                msg: 'controllerError - getInfo',
                error: error
            })
        }
    }

    getRandom = async (req, res) => {
        const info = this.info

        let username = res.locals.username
        let userInfo = res.locals.userInfo

        const usuarios = await this.users.getUserByUsername(username)
        const userId = usuarios._id // User Id
        let cart = await this.carts.getCartByUserId(userId)

        const number = req.body.random
        const maxCount = 10000
        const cant = number || maxCount
        const forked = fork(path.resolve(__dirname, '../utils/computo.js'), [cant])
        
        if (cant <= maxCount) {
            forked.on('message', (msg) => {
                res.render('testSystem', { msg , username, userInfo, cart })
                res.end( msg )
            })
            forked.send('start')
        
        } else {
            res.json({ Mensaje: `What you are trying to do... kill your CPU by computing ${cant} randon numbers?`})
        }
    }
}

module.exports = { InfoController }