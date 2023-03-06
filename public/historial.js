const socket = io.connect()

//  ---------------- Products list ----------------
socket.on('productsAll', (arrProd, arrUsers) => {
    const cadena = document.getElementById('mostrarUserName').innerText
    let indice = cadena.indexOf(",");
    const name = cadena.substring(7,indice)
    let index = arrUsers.findIndex(el=> el.name == name.trim())
   
    if(index !== -1) {
        let user = arrUsers[index].admin
        user ? renderProductAdmin(arrProd) : renderProductUser(arrProd)
    }   
})

const renderProductAdmin = (arrProd) => {
    const arrayProd = arrProd
    const blue = 'primary'
    const red = 'danger'
    
    const html = arrProd.map((element) => {
        let stock = element.stock > 0 ? blue : red
        return (`<tr>
                    <th scope="row" class="text-center"><strong>${element._id}</strong></th>
                    <td class="text-center">${element.name}</td>
                    <td class="text-center">${element.description}</td>
                    <td class="text-center">$${element.price}</td>
                    <td class="text-center"><img class="img-fluid rounded" alt="Product image not found" src='${element.picture}' width="100px" height="80px"></td>
                    <td class="text-center">${element.code}</td>
                    <td class="text-center"><span class="badge rounded-pill bg-${stock}">${element.stock}</span></td>
                    <td class="text-center">${element.category}</td>
                    <td class="text-center">
                        <div class="d-block align-items-center">
                            <a href="/api/productos/${element._id}" class="btn btn-primary btn-sm me-1"><i class="fa fa-pencil"></i></a>
                            <a href="/api/productos/delete/${element._id}" class="btn btn-danger btn-sm mx-1"><i class="fa fa-trash"></i></a>
                        </div>
                    </td>
                </tr>`)
    }).join(" ");

    document.getElementById('mostrarProductos').innerHTML = html

    const htmlProdList = 
        ( `<caption id="capProdList">Total Product List ${arrayProd.length}</caption>`)

    document.getElementById('capProdList').innerHTML = htmlProdList
}

//-----------------------
const renderProductUser = (arrProd) => {
    const arrayProd = arrProd

    const html = arrProd.map((element) => {
        return (`<tr>
                    <th scope="row" class="text-center"><strong>${element._id}</strong></th>
                    <td class="text-center">${element.name}</td>
                    <td class="text-center">${element.description}</td>
                    <td class="text-center">$${element.price}</td>
                    <td class="text-center"><img class="img-fluid rounded" alt="Product image not found" src='${element.picture}' width="100" height="80"></td>
                    <td class="text-center">${element.code}</td>
                    <td class="text-center">${element.stock}</td>
                    <td class="text-center">${element.category}</td>
                    <td class="text-center">
                        <i class="fa fa-info-circle fa-2x data-toggle="tooltip" data-placement="top" title="Only Admin can change this" aria-hidden="true"></i>
                    </td>
                </tr>`)
    }).join(" ");

    document.getElementById('mostrarProductos').innerHTML = html

    const htmlProdList = 
        ( `<caption id="capProdList">Total Product List ${arrayProd.length}</caption>`)

    document.getElementById('capProdList').innerHTML = htmlProdList
}