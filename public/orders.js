const socket = io.connect()

// ---------- Orders historial ----------------
socket.on('ordersAll', (arrOrders) => {
    renderOrder(arrOrders)
})

const renderOrder = (arrOrders) => {
    const arrayOrders = arrOrders

    const html = arrayOrders.map((element) => {
        let prodArr = []
        function loopProductId() {
            for (i=0; i < element.items.length; i++) {
                prodArr.push(element.items[i].productId)
            }
            return prodArr.join('\n')
        }

        let qtyArr = []
        function loopQuantity() {
            for (i=0; i < element.items.length; i++) {
                qtyArr.push(element.items[i].quantity)
            }
            return qtyArr.join('\n')
        }
        const green = 'success'
        const red = 'danger'

        let optionStatus = element.actvie ? green : red
        let showStatus = element.active ? 'Not deliver' : 'Deliver'

        return (`<tr>
                    <th scope="row" class="text-center my-3"><strong>${element._id}</strong></th>
                    <td class="text-center my-3">${loopProductId()}</td>
                    <td class="text-center my-3">${loopQuantity()}</td>
                    <td class="text-center my-3"><strong>${element.subTotal}</strong></td>
                    <td class="text-center my-3">${element.invoice_nr}</td>
                    <td class="text-center my-3">${element.modifiedOn}</td>
                    <td class="text-center my-3"><span class="badge rounded-pill bg-${optionStatus}"</span>${showStatus}</td>
                    <td class="text-center align-items-center mx-auto my-3">
                        <div class="d-block align-items-center my-2">
                            <a href="#" class="btn-success btn-sm mx-1 data-toggle="tooltip" data-placement="top" title="To Be Done" disabled"><i class="fa fa-car"></i></a>
                            <a href="#" class="btn-primary btn-sm mx-1 data-toggle="tooltip" data-placement="top" title="To Be Done" disabled"><i class="fa fa-pencil"></i></a>
                            <a href="#" class="btn-danger btn-sm mx-1 data-toggle="tooltip" data-placement="top" title="To Be Done" disabled"><i class="fa fa-trash"></i></a>
                        </div>
                    </td>
                </tr>`)
    }).join(" ");

    document.getElementById('mostrarOrdenes').innerHTML = html

    const htmlOrderList = 
        ( `<caption id="capOrdersList">Total Orders List ${arrayOrders.length}</caption>`)

    document.getElementById('capOrdersList').innerHTML = htmlOrderList
}