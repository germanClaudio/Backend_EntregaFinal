const socket = io.connect()
// const now = require('../utils/formatDate.js')

// --------------------- update ---------------------------------------- 
socket.on('updateUsuario', async (arrUser) => {
    renderUpdatedUser (await arrUser)
})

const updateUsuario = () => {
    const _id = document.getElementById('id').value
    const name = document.getElementById('name').value
    const lastName = document.getElementById('lastName').value
    const email = document.getElementById('email').value
    const username = document.getElementById('username').value
    const avatar = document.getElementById('picture').value
    const status = document.getElementById('status').checked
    status ? status = true : status = false
    const admin = document.getElementById('admin').checked
    admin ? admin = true : admin = false
    // const timestamp = now

    socket.emit('updateUsuario', {
        _id,
        name,
        lastName,
        email,
        username,
        avatar,
        status,
        admin,
        timestamp
    })
    return false
}    

const renderUpdatedUser = (arrUser) => {
    const html2 = arrUser.map((element) => {
    
        return (`<div class="d-block mx-auto my-3 w-75 text-center alert alert-success h5"
        role="alert">Producto actualizado exitosamente!</div>`
                )
    }).join(" ");

    document.getElementById('updateUsuario').innerHTML = html2
}
