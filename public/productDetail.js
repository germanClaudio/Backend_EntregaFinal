const socket = io.connect()

function formatDate(date) {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const hours = date.getHours()
    const min = date.getMinutes()
    const sec = date.getSeconds()
    return day + "-" + month + "-" + year + "_" + hours + "." + min + "." + sec
}

// --------------------- update ---------------------------------------- 
socket.on('updateProducto', async (arrProd) => {
    renderUpdatedProduct (await arrProd)
})

const updateProducto = () => {
    const _id = document.getElementById('id').value
    const name = document.getElementById('name').value
    const timestamp = formatDate(new Date())
    const description = document.getElementById('description').value
    const price = Number(document.getElementById('price').value)
    const picture = document.getElementById('picture').value
    const code = document.getElementById('code').value
    const stock = Number(document.getElementById('stock').value)
    let e = document.getElementById('category')
    const category = e.value

    socket.emit('updateProducto', {
        _id,
        name,
        description,
        price,
        picture,
        code,
        stock,
        category,
        timestamp
    })
    return false
}    

const renderUpdatedProduct = (arrProd) => {
    const html2 = arrProd.map((element) => {
    
        return (`<div class="d-block mx-auto my-3 w-75 text-center alert alert-success h5"
        role="alert">Producto actualizado exitosamente!</div>`
                )
    }).join(" ");

    document.getElementById('updateProducto').innerHTML = html2
}
