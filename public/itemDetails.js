const maxStock = parseInt(document.getElementById('stock').value)
//-------------------------- Add quatity --------------------------------------------
function incrementValue() {
    let value = parseInt(document.getElementById('number').value)
    value = isNaN(value) ? 0 : value
    if(value < maxStock){
        value++
            document.getElementById('number').value = value
    }
}

//-------------------------- Remove quatity --------------------------------------------
function decrementValue() {
    let value = parseInt(document.getElementById('number').value)
    value = isNaN(value) ? 0 : value
    if(value > 1){
        value--
            document.getElementById('number').value = value
    }
}