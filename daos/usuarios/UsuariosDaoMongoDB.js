const ContainerMongoDB = require('../../contenedores/usuarios/containerMongoDB.js')

const Usuarios = require('../../models/usuarios.models.js')
const logger = require('../../utils/winston.js')
const now = require('../../utils/formatDate.js')

//const crypto = require('crypto')
const bCrypt = require('bcrypt');

class UsuariosDaoMongoDB extends ContainerMongoDB {
    constructor(cnxStr) {
        super(cnxStr)
    }

    async init() {
        await this.connection
        console.log('Connected to MongoDB Server 1-2-3')
   }

   async getAllUsers(){
       try {
           const users = await Usuarios.find()
           if ( users === [] || users === undefined || users === null) {
                return new Error ('No hay usuarios en la DB!')
           } else {
                return users    
           }
        } catch (error) {
            logger.error("Error MongoDB getUsers: ",error)
            return new Error ('No hay usuarios en la DB!')
        }
    }

    async getUserById(id){
        if(id){
            try {
                const user = await Usuarios.findOne( {_id: `${id}`} )
                if ( user === [] || user === undefined || user === null) {
                    return new Error (`El Usuario no existe con ese ID${id}!`)
                } else {
                    return user    
                }
            } catch (error) {
                logger.error(error)
            }
        } else {
            return new Error (`El Usuario no existe con ese ID${id}!`)
        }
    }
    
    async getUserByUsername(username){
        if(username){
            try {
                const user = await Usuarios.findOne( { username: `${username}` })
                
                 if ( user === [] || user === undefined || user === null) {
                    return new Error (`El Usuario no existe con el username: ${username}`)
                 } else {
                    return user    
                 }
            } catch (error) {
                logger.error('aca esta el error, no entra a Mongo: ', error)
            }
        } else {
            return new Error (`El Usuario no existe con este username: ${username}!`)
        }
    }
    
    async getUserByUsernameAndPassword(username, password) {
        if(username || password) {
            try {
                const user = await Usuarios.findOne( {username: `${username}`, password: `${password}` } )
                if ( user === [] || user === undefined || user === null || password !== user.password ) {
                    return false    
                } else {
                    return true
                }
            } catch (error) {
                logger.error(error)
            }
        } else {
            return new Error (`Usuario no existe o password incorrecto!`)
        }
    }
    
    async createNewUser(usuario) {
        if (usuario) {
            let username = usuario.username || "";
            let password = usuario.password || "";
            username = username.replace(/[!@#$%^&*]/g, "")

            const users = await Usuarios.findOne({username: `${usuario.username}`})

            if(users) {
                return new Error (`Ya existe un usuario con ese username: ${usuario.username}!`)
            }

            if (!username || !password ) {
                process.exit(1)
            } else {
                try {
                    function createHash(password) {
                        return bCrypt.hashSync(
                                  password,
                                  bCrypt.genSaltSync(10),
                                  null);
                    }
                    password = createHash(password)
        
                    const nuevoUsuario = { 
                        name: usuario.name,
                        lastName: usuario.lastName,
                        email: usuario.email,
                        username: username,
                        avatar: usuario.avatar,
                        password: password,
                        status: true,
                        admin: false,
                        timestamp: now,
                    }             

                    const newUser = new Usuarios(nuevoUsuario)
                    await newUser.save()
                    logger.info('User created: ' + newUser)
                    
                    //////////////////// phone text message //////////////////////
                    const accountSid = process.env.TWILIO_ACCOUNTSID;
                    const authToken = process.env.TWILIO_AUTH_TOKEN;
                    const fromPhone = process.env.PHONE_SENDER;
                    const toPhone = process.env.PHONE_RECEIVER;
                    const client = require("twilio")(accountSid, authToken);
                    
                    ;(async () => {
                        try {
                            const message = await client.messages.create({
                                body: `El usuario ${newUser.name} ${newUser.lastName}, se registro exitosamente!`,
                                from: fromPhone, 
                                to: toPhone
                            })
                            logger.info(message)
                        } catch (error) {
                            logger.error(error)
                        }
                    })()
                    
                    //////////////////// gmail to Administrator //////////////////////
                    const { createTransport } = require('nodemailer')
                    const TEST_EMAIL = process.env.TEST_EMAIL
                    const PASS_EMAIL = process.env.PASS_EMAIL
                    
                    const transporter = createTransport({
                        service: 'gmail',
                        port: 587,
                        auth: {
                            user: TEST_EMAIL,
                            pass: PASS_EMAIL
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    })
                    
                    const mailOptions = {
                        from: 'Servidor NodeJS - @Gmail - Ecommerce - German Montalbetti (C)2023',
                        to: TEST_EMAIL,
                        subject: 'Mail nuevo Registro Usuario desde NodeJS - @Gmail - Ecommerce - German Montalbetti (C)2023',
                        html: `<h3 style="color: green;">El usuario ${newUser.name} ${newUser.lastName}, se registro exitosamente en la base de datos!</h3>`,
                        attachments: [
                            {
                                path: 'https://res.cloudinary.com/hdsqazxtw/image/upload/v1600707758/coderhouse-logo.png'
                            }
                        ]
                    }
                    
                    ;(async () => {
                        try {
                            const info = await transporter.sendMail(mailOptions)
                            logger.info(info)
                        } catch (err) {
                            logger.error(err)
                        }
                    })()
                    return newUser
                } catch (error) {
                    logger.error(error)
                    return new Error (`No se pudo crear el Usuario!`)
                }
            }   
        } else {
            return new Error (`No se pudo crear el Usuario!`)
        }
    }

    async updateUser(id, user){
        const userMongoDB = await Usuarios.findById( { _id: `${id}` } )
                
        if (userMongoDB) {
            try {
                let adminValue, statusValue = ""
                user.admin === "on" ? adminValue = true : adminValue = false
                user.status === "on" ? statusValue = true : statusValue = false
                 const newValues = {
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    username: user.username,
                    avatar: user.avatar,
                    password: userMongoDB.password,
                    admin: adminValue,
                    status: statusValue,
                    timestamp: now,
                }
                
                const userUpdated = await Usuarios.findOneAndUpdate(
                    { _id: id }, newValues , { new: true })
                return userUpdated
               
            } catch (error) {
                logger.error("Error MongoDB updateUser: ", error)
                return new Error (`No se pudo actualizar el Usuario!`)
            }
        } else {
            logger.info('El Ususario no existe! ', userMongoDB)
            return new Error (`No se pudo actualizar el Usuario!`)
        }
    }

    async deleteUserById(id) {
        if(id){
            const userMongoDB = await Usuarios.findById({_id: `${id}`})
            
            if(userMongoDB) {
                try {
                    const newValues = {
                        name: userMongoDB.name,
                        lastName: userMongoDB.lastName,
                        email: userMongoDB.email,
                        username: userMongoDB.username,
                        password: userMongoDB.password,
                        admin: userMongoDB.admin,
                        active: false,
                        timestamp: now,
                    }
                    const user = await Usuarios.findOneAndUpdate(
                        { _id: id }, newValues , { new: true })
                    return user

                } catch (error) {
                    logger.error("Error MongoDB deleteUser: ",error)
                }
            } else {
                return new Error (`El Usuario no existe con ese Id: ${id}!`)
            }
        } else {
            return new Error (`El Usuario no existe con ese ID${id}!`)
        }    
    }

    async disconnet() {
        await this.disconnection
        console.log('Disconnected from MongoDB Server')
    }
}

module.exports = UsuariosDaoMongoDB 