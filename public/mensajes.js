const socket = io.connect()

function formatDate(date) {
    const DD = date.getDate();
    const MM = date.getMonth() + 1;
    const YY = date.getFullYear();
    const hh = date.getHours();
    const mm = date.getMinutes();
    const ss = date.getSeconds();
    return DD + "-" + MM + "-" + YY + "_" + hh + "." + mm + "." + ss
}


// ----------------  Messages ----------------
socket.on('mensajesAll', (arrMensajes, arrUsers) => {
    const cadena = document.getElementById('mostrarUserName').innerText
    let indice = cadena.indexOf(",");
    const name = cadena.substring(7,indice)
    let index = arrUsers.findIndex(el=> el.name == name.trim())
    
    if(index !== -1) {
        let user = arrUsers[index].admin
        user ? renderMessageAdmin(arrMensajes) : renderMessageUser(arrMensajes)
    }   
})


const addMessage = () => {
    const mensaje = {
        author: {
            email: document.getElementById('author').value,
            name: document.getElementById('name').value,
            lastName: document.getElementById('lastName').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: document.getElementById('text').value,
        date: formatDate(new Date()),
        status: true
    }

    socket.emit('newMensaje', mensaje )
    return false
}

const renderMessageAdmin = async (arrMensajes) => {

    const htmlMsg = await arrMensajes.map((mensaje) => {

        if(mensaje.status === true) {
            return  (`<div class="d-block mx-auto mt-2 mb-3 p-2 border border-light shadow">
                        <strong class="text-secondary"> Message from -> </strong>
                        <strong class="fw-bold text-primary">${mensaje.author.email}</strong>
                        <img class="img-fluid rounded-circle" alt="avatar" src='${mensaje.author.avatar}' width="60" height="60"><br>
                        <e id="colorBrown" style="color:brown;">Sended on: ${mensaje.date} </e>: 
                        <em  class="fw-bold text-dark"> "${mensaje.text}"</em>
                        <div class="d-flex align-items-end flex-column mb-3 me-5">
                            <a href="/api/webchat/delete/${mensaje._id}" class="btn btn-danger btn-sm mx-1"><i class="fa fa-trash"></i></a>
                        </div>
                    </div>
                   `)
        } else {
            return null
        }

    }).join(" ")

    document.getElementById('mostrarMensajes').innerHTML = htmlMsg
    document.getElementById('text').value = ""
}

const renderMessageUser = async (arrMensajes) => {

    const htmlMsg = await arrMensajes.map((mensaje) => {
        if(mensaje.status === true) {
            return  (`<div class="d-block mx-auto mt-2 mb-3 p-2 border border-light shadow">
                        <strong class="text-secondary"> Message from -> </strong>
                        <strong class="fw-bold text-primary">${mensaje.author.email}</strong>
                        <img class="img-fluid rounded-circle" alt="avatar" src='${mensaje.author.avatar}' width="60" height="60"><br>
                        <e id="colorBrown" style="color:brown;">Sended on: ${mensaje.date} </e>: 
                        <em  class="fw-bold text-dark"> "${mensaje.text}"</em>
                        <div class="d-flex align-items-end flex-column mb-3 me-5">
                            <i class="fa fa-check-circle fa-2x data-toggle="tooltip" data-placement="top" title="Only Admin can change this" style="color:green;" aria-hidden="true"></i>
                        </div>
                   </div>`)
        } else {
            return null
        }

    }).join(" ")

    document.getElementById('mostrarMensajes').innerHTML = htmlMsg

    document.getElementById('text').value = ""
}