const ContainerArchivo = require("../../contenedores/productos/containerArchivo.js")
const fs = require("fs")
const { asDto } = require('../../dto/productosDto.js')


class ProductosDaoArchivo extends ContainerArchivo {

  constructor(filePath) {
    super(filePath)
  }

  async getAllProducts() {
    const fileContent = await this.readFile()
    if (fileContent.length !== 0) {
      return asDto(fileContent)
    } else {
      console.log("Lo sentimos, la lista de Productos está vacía!!!")
    }
  }

  async getProductById(id) {
    const product = await this.getIndex(id)
    if (product !== undefined) {
      return asDto(product)
    } else {
      console.log(
        "Lo sentimos, el Id del producto ingresado no existe en nuestra Base de Datos!!"
      )
    }
  }

  async createNewProduct(product) {
    const fileContent = await this.readFile()
    if (fileContent.length !== 0) {
        await this.writeFile(JSON.stringify([...fileContent, { id: fileContent[fileContent.length - 1].id + 1, ...product } ], null, 2))
        const newFileContent = await this.readFile()
        return asDto(newFileContent)
    } else {
      try {
        await this.writeFile(JSON.stringify([{ id: 1, ...product }], null, 2))
        const newFileContent = await this.readFile()
        return asDto(newFileContent)
      } catch (error) {
        console.log("Error al escribir en archivo--vacio!! \n" + error);
      }
    }
  }

  async updateProduct(id, productoNuevo) {
    const fileContent = await this.readFile()
    const index = this.getIndex(id)
        const actualizada = { ...fileContent [ index ], ...productoNuevo }
        this.filePath.splice(index, 1, actualizada)
        await this.writeFile()
        return asDto(actualizada)

  }

  async deleteProduct(id) {
    const fileContent = await this.readFile()

    const nonDeletedProducts = fileContent.filter((item) => item.id !== parseInt(id))
    const productToBeDeleted = fileContent.filter((item) => item.id === parseInt(id));

    if (productToBeDeleted.length > 0) {
      try {
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify(nonDeletedProducts, null, 2)
        );
        console.log(
          `Producto ${JSON.stringify(
            productToBeDeleted,
            null,
            2
          )} \nEliminado con éxito de la Base de Datos!!\n`
        )
        return asDto()
      } catch (error) {
        console.log("Error al escribir en archivo!! \n" + error);
      }
    } else {
      console.log(
        "Lo sentimos, el Id del producto ingresado NO existe en nuestra Base de Datos"
      );
    }
  }

  async deleteAll() {
    const fileContent = await this.readFile()

    if (fileContent.length > 0) {
      try {
        await fs.promises.writeFile(
          this.filePath,
          JSON.stringify([], null, 2),
          "utf-8"
        );
        console.log(
          "Todos los productos han sido Eliminados de la Base de Datos!!!"
        );
      } catch (error) {
        console.log("Error al escribir en archivo!! \n" + error);
      }
    } else {
      console.log("La Base de Datos está vacía!!!");
    }
  }
  //----------------------------------------------------------------
}

module.exports = ProductosDaoArchivo;
