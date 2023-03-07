const ContenedorMongoDB = require("../../contenedores/carritos/containerMongoDB.js");

const Carritos = require("../../models/carritos.models.js");
const Productos = require("../../models/productos.models.js");
const Ordenes = require("../../models/ordenes.models.js");
const logger = require("../../utils/winston.js");
const now = require("../../utils/formatDate.js");

class CarritosDaoMongoDB extends ContenedorMongoDB {
  constructor(cnxStr) {
    super(cnxStr);
  }

  async init() {
    await this.connection;
  }

  async getArrProducts(data) {
    try {
      let arrProducts = [];
      if (data) {
        for (let i = 0; i < data.items.length; i++) {
          let products = await Productos.findById(data.items[i].productId)
          arrProducts.push(products)
        }
      }
      return arrProducts
    } catch (error) {
      logger.error("Error MongoDB getArrProducts: ", error)
    }
  }

  async reduceStockProduct(data) {
    try {
      let arrStockProduct = []
      if (data) {
        for (let i = 0; i < data.items.length; i++) {
          let productos = await Productos.findById(data.items[i].productId)
          let quantity = data.items[i].quantity;
          let updatedStock = productos.stock - quantity;

          if (productos) {
            const newValues = {
              name: productos.name,
              description: productos.description,
              price: productos.price,
              code: productos.code,
              picture: productos.picture,
              stock: updatedStock,
              timestamp: now,
              category: productos.category,
            };

            const productUpdated = await Productos.findOneAndUpdate(
              { _id: data.items[i].productId },
              newValues,
              { new: true }
            );
            
            arrStockProduct.push(productUpdated)
          }
        }
      }
      return arrStockProduct;
    } catch (error) {
      logger.error("Error MongoDB reduceStockProduct: ", error)
    }
  }

  async getCart(id) {
    try {
      const carts = await Carritos.findById(`${id}`).populate("_id")
      return carts
    } catch (error) {
      logger.error("Error MongoDB getCart: ", error)
    }
  }

  async getCartByUserId(id) {
    try {
      const cart = await Carritos.findOne({ userId: `${id}` })
      if (cart) {
        return cart
      } else {
        return null
      }

    } catch (error) {
      logger.error("Error MongoDB getCartByUserId: ", error)
    }
  }

  async addItemToCart(payload) {
    const infoId = payload.items[0]
    const productId = infoId.productId

    try {
      // -------------- Product validation ----------------
      const itemMongoDB = await Productos.findOne({ _id: `${productId}` })

      if (itemMongoDB) {
        const newItem = await Carritos.create(payload)
        return newItem
      } else {
        logger.info(
          "No se puede agregar Producto a Cart o el Producto no existe!"
        );
      }
    } catch (error) {
      logger.error("Error MongoDB adding Product to cart: ", error)
    }
  }

  async removeItemFromCart(payload) {
    const infoId = payload.items[0]
    const productId = infoId.productId

    try {
      // -------------- Product validation ----------------
      const itemMongoDB = await Productos.findOne({ _id: `${productId}` })

      if (itemMongoDB) {
        const itemToRemove = await Carritos.findByIdAndDelete({
          _id: `${productId}`,
        });
        return itemToRemove;
      } else {
        logger.info(
          "No se puede eliminar el Producto del Cart o el Producto no existe!"
        );
      }
    } catch (error) {
      logger.error("Error MongoDB adding Product to cart: ", error)
    }
  }

  async emptyCart(id) {
    try {
      const productDeleted = await Carritos.findByIdAndUpdate(id);
      return productDeleted;
    } catch (error) {
      logger.error("Error MongoDB deleteProduct: ", error);
    }
  }

  async genOrderCart(cart, invoice) {
    const cartId = cart._id.valueOf();
    if (cart) {
      try {
        // -------------- Cart validation ----------------
        const cartMongoDB = await Carritos.findOne({ _id: `${cartId}` });

        if (cartMongoDB) {
          const newOrder = await Ordenes.create(invoice);
          return newOrder;
        } else {
          logger.info("No se puede crear la OC o el Carrito no existe!");
        }
      } catch (error) {
        logger.error("Error MongoDB generating OC of cart: ", error);
      }
    } else {
      return new Error(`No se pudo crear la Orden de Compra!`);
    }
  }

  async getAllOrders() {
    try {
      const orders = await Ordenes.find();
      return orders;
    } catch (error) {
      logger.error("Error MongoDB getAllOrdes: ", error);
      return new Error("No hay ordenes en la DB!");
    }
  }

  async disconnet() {
    await this.disconnection;
  }
}

module.exports = CarritosDaoMongoDB;
