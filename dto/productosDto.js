// ---- DTO ---- NO en uso para esta app --------------

class ProductsDto {
    constructor({ id, name, description, price, picture, code, stock, timestamp }) {
        this.id = id
        this.name = name
        this.description = description
        this.price = price
        this.picture = picture
        this.code = code
        this.stock = stock
        this.timestamp = timestamp
        // for (const [denominacion, valor] of Object.entries(cotizaciones)) {
        //     this[denominacion] = valor 
        // }
    }
}

function asDto(products) {
    console.log('asDto: ', products)
    
    if (Array.isArray(products)) 
        return products.map(p => new ProductsDto(p) )
     else 
        return new ProductsDto(products)
}

module.exports = { asDto }