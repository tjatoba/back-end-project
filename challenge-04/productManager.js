const fs = require("fs").promises;

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.nextId = 1; // ID inicial
  }

  async addProduct(product) {
    try {
      const { title, description, price, thumbnail, code, stock } = product;

      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("Todos os campos são obrigatórios.");
      }

      const products = await this.getProduct();
      const codeExists = products.some((prod) => prod.code === code);
      if (codeExists) {
        throw new Error(`Produto com o código '${code}' já existe.`);
      }

      const newProduct = {
        id: this.nextId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      products.push(newProduct);
      this.nextId++;

      await this.saveProducts(products);

      return newProduct;
    } catch (error) {
      throw new Error(`Erro ao adicionar produto: ${error.message}`);
    }
  }

  async getProduct() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw new Error(`Erro ao ler produtos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProduct();
      const product = products.find((prod) => prod.id === id);
      if (!product) {
        throw new Error("Produto não encontrado.");
      }
      return product;
    } catch (error) {
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const products = await this.getProduct();
      const index = products.findIndex((prod) => prod.id === id);
      if (index === -1) {
        throw new Error("Produto não encontrado.");
      }

      const productToUpdate = products[index];
      products[index] = { ...productToUpdate, ...updatedProduct };

      await this.saveProducts(products);

      return products[index];
    } catch (error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProduct();
      const filteredProducts = products.filter((prod) => prod.id !== id);
      if (products.length === filteredProducts.length) {
        throw new Error("Produto não encontrado.");
      }

      await this.saveProducts(filteredProducts);
    } catch (error) {
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
  }

  async saveProducts(products) {
    try {
      await fs.writeFile(
        this.filePath,
        JSON.stringify(products, null, 2),
        "utf-8"
      );
    } catch (error) {
      throw new Error(`Erro ao salvar produtos: ${error.message}`);
    }
  }
}

// Exemplo de uso com async/await:

(async () => {
  const manager = new ProductManager("products.json");

  try {
    // Adicionando produtos
    const product1 = await manager.addProduct({
      title: "Produto 1",
      description: "Descrição do Produto 1",
      price: 100,
      thumbnail: "url_imagem_1",
      code: "ABC123",
      stock: 10,
    });
    console.log("Produto adicionado:", product1);

    const product2 = await manager.addProduct({
      title: "Produto 2",
      description: "Descrição do Produto 2",
      price: 200,
      thumbnail: "url_imagem_2",
      code: "DEF456",
      stock: 5,
    });
    console.log("Produto adicionado:", product2);

    // Obtendo todos os produtos
    const products = await manager.getProduct();
    console.log("Todos os produtos:", products);

    // Atualizando um produto
    const updatedProduct = await manager.updateProduct(1, { price: 120 });
    console.log("Produto atualizado:", updatedProduct);

    // Deletando um produto
    await manager.deleteProduct(2);
    console.log("Produto deletado.");

    // Tentativa de buscar um produto que foi deletado
    await manager.getProductById(2);
  } catch (error) {
    console.error("Erro:", error.message);
  }
})();
