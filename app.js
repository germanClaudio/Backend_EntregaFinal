const initServer = require("./server");

const app = initServer()
const PORT = process.env.PORT || 4000 //process.argv.slice(2)[0] || 4000

try {
    app.listen(PORT)
    console.log(`Escuchando en el puerto ${PORT}`)
} catch (error) {
    console.log(error)
}
