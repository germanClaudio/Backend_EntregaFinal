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

// -------------- Show All Products ----------------
socket.on('productsAll', async (arrProd) => {
    renderProduct (await arrProd)
})

const addProduct = () => {
    const name = document.getElementById('name').value
    const timestamp = formatDate(new Date())
    const description = document.getElementById('description').value
    const price = Number(document.getElementById('price').value)
    const picture = document.getElementById('picture').value
    const code = document.getElementById('code').value
    const stock = Number(document.getElementById('stock').value)
    let e = document.getElementById('category')
    const category = e.value

    socket.emit('newProducto', {
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

const renderProduct = (arrProd) => {
    const noStock = 'No Stock'
    const lastAvailable = 'Last Availables'
    let stock = ''
    let disabled = 'disabled'
    const red = 'danger'
    const green = 'success'
    const grey = 'secondary'

    const html = arrProd.map((element) => {

    if(element.stock >= 3 && element.stock < 6) {
        stock = lastAvailable
        disabled = ''
        color = red
    } else if(element.stock === 0 ) {
        stock = noStock
        color = grey
    } else {
        stock = element.stock
        disabled = ''
        color = green
    }

        if(element.stock > 0) {
            return (`<div class="col m-3">
                        <div class="card h-100" style="width: 18rem;">
                            <img src="${element.picture}" class="card-img-top" alt="Picture not Founded" height="215px" >
                            <div class="card-body">
                                <h6 class="card-title"><strong>${element.name}</strong></h6>
                                <p class="card-text">${element.description}<br>
                                                    Price (USD): ${element.price}<br>
                                                    Code: ${element.code}<br>
                                                    Stock: <span class="badge rounded-pill bg-${color}">${stock}</span><br>
                                                    Category: ${element.category}<br>
                                </p>
                                <div class="card-footer">         
                                    <a href="/api/productos/select/${element._id}" class="btn btn-dark mx-auto w-75" role="button"><i class="fa fa-info-circle"></i> See Details</a>
                                </div>
                            </div>
                        </div>
                    </div>`
                    )
        } else {
            return (`<div class="col m-3">
                        <div class="card h-100" style="width: 18rem;">
                            <img src="${element.picture}" class="card-img-top" alt="Picture not Founded" height="215px" >
                            <div class="card-body">
                                <h6 class="card-title"><strong>${element.name}</strong></h6>
                                <p class="card-text">${element.description}<br>
                                                    Price (USD): ${element.price}<br>
                                                    Code: ${element.code}<br>
                                                    Stock: <span class="badge rounded-pill bg-${color}">${stock}</span><br>
                                                    Category: ${element.category}<br>
                                </p>
                                <div class="card-footer">         
                                <span class="badge rounded-pill bg-${color}"><i class="fa fa-frown-o"></i> Sorry! No stock</span>
                                </div>
                            </div>
                        </div>
                    </div>`
                    )
        }
    }).join(" ");
        
    document.getElementById('mostrarProductos').innerHTML = html
}

// --------------------- update ---------------------------------------- 
socket.on('updateProducto', async (arrProd) => {
    renderUpdatedProduct (await arrProd)
})

const updateProduct = () => {
    const _id = document.getElementById('id').value
    const name = document.getElementById('name').value
    const timestamp = formatDate(new Date())
    const description = document.getElementById('description').value
    const price = Number(document.getElementById('price').value)
    const picture = document.getElementById('picture').value
    const code = document.getElementById('code').value
    const stock = Number(document.getElementById('stock').value)
    const category = document.getElementById('category').value

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