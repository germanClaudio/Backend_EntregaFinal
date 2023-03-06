const logger = require('../utils/winston')

const ContainerMessages = require("../daos/mensajes/MensajesDaoFactory.js")
const containerMsg = ContainerMessages.getDaoMsg()

const ContainerProducts = require("../daos/productos/ProductosDaoFactory.js")
const containerProduct = ContainerProducts.getDao()

const ContainerUsers = require("../daos/usuarios/UsuariosDaoFactory.js")
const containerUser = ContainerUsers.getDaoUsers()

const ContainerCarts = require("../daos/carritos/CarritosDaoFactory.js")
const containerCarts = ContainerCarts.getDaoCart()

const { schema } = require("normalizr")

const initSocket = (io) => {
  io.on("connection", async (socket) => {
        logger.info("Nuevo cliente conectado!")
        
        // --------------------------  Products --------------------------------
        socket.emit('productsAll',
            await containerProduct.getAllProducts(),
            await containerUser.getAllUsers()
        ) 
        
        socket.on('newProducto', async (producto) => {
            await containerProduct.createNewProduct(producto)
            io.sockets.emit('productsAll', await containerProduct.getAllProducts()) //getCotizacionEnDolares())
        })
        
        socket.on('updateProducto', async (id, producto) => {
            await containerProduct.updateProduct(id, producto)
            io.sockets.emit('productsAll', await containerProduct.getAllProducts()) //.getCotizacionEnDolares())
        })
        
        socket.on('deleteProducto', async (producto) => {
            await containerProduct.deleteProductById(producto)
            io.sockets.emit('productsAll', await containerProduct.getAllProducts())//getCotizacionEnDolares())
        })
        
    //-------------------------------- Users  ----------------------------------
    socket.on('newUsuario', async (usuario) => {
        await containerUser.createNewUser(usuario)
        io.sockets.emit('usersAll', await containerUser.getAllUsers()) //getCotizacionEnDolares())
    })
    
    // --------------------------------  Orders  -------------------------------
      socket.emit('ordersAll', await containerCarts.getAllOrders())

    // -----------------------------  Messages ---------------------------------
        // const normalizarMensajes = (mensajesConId) =>
        // normalize(mensajesConId, schemaMensajes)

        async function listarMensajesNormalizados() {
            const mensajes = await containerMsg.getAllMessages()
            // const normalizados = normalizarMensajes({ mensajes }); //id: "mensajes",
            
            return mensajes//normalizados;
            }

        // NORMALIZACIÓN DE MENSAJES
        // Definimos un esquema de autor
        const schemaAuthor = new schema.Entity("author", {}, { idAttribute: "email" } );
        // Definimos un esquema de mensaje
        const schemaMensaje = new schema.Entity("post", { author: schemaAuthor }, { idAttribute: "id" });
        // Definimos un esquema de posts
        const schemaMensajes = new schema.Entity("posts", { mensajes: [schemaMensaje] }, { idAttribute: "id" });

        socket.emit("mensajesAll",
        await listarMensajesNormalizados(),
        await containerUser.getAllUsers()
        )

        socket.on("newMensaje", async (message) => {
            await containerMsg.createNewMessage(message)
            io.sockets.emit("mensajesAll", await listarMensajesNormalizados())
        })
    
        //-------------------- usuarios ----------------------
        socket.emit('usersAll', await containerUser.getAllUsers())

        socket.on('newUsuario', async (usuario) => {
            await containerUser.createNewUser(usuario)
            io.sockets.emit('usersAll', await containerUser.getAllUsers())
        })

        socket.on('disconnect', () => {
            logger.info(`User desconectado`)
        })
    })
}

module.exports = initSocket