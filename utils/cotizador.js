class Cotizador {
    static VALOR_DOLAR = 345
    static VALOR_EURO = 375
    static VALOR_REAL = 250

    getPrecioSegunMoneda(price, moneda) {
        switch(moneda) {
            case 'USD' : return (price / Cotizador.VALOR_DOLAR).toFixed(2)
            case 'EUR' : return (price / Cotizador.VALOR_EURO).toFixed(2)
            case 'BRL' : return (price / Cotizador.VALOR_REAL).toFixed(2)
            default: return price
        }
    }
}
module.exports = { Cotizador }