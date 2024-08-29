class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1; // ID inicial
  }

  addProduct(product) {
    return new Promise((resolve, reject) => {
      const { title, description, price, thumbnail, code, stock } = product;

      // Validação: todos os campos são obrigatórios
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        return reject("Todos os campos são obrigatórios.");
      }

      // Validação: o campo 'code' não deve se repetir
      const codeExists = this.products.some((prod) => prod.code === code);
      if (codeExists) {
        return reject(`Produto com o código '${code}' já existe.`);
      }

      // Cria um novo produto com um ID incremental
      const newProduct = {
        id: this.nextId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      // Adiciona o produto ao array
      this.products.push(newProduct);

      // Incrementa o ID para o próximo produto
      this.nextId++;

      // Resolve a promise com o novo produto
      resolve(newProduct);
    });
  }

  getProductById(id) {
    return new Promise((resolve, reject) => {
      const product = this.products.find((prod) => prod.id === id);
      if (!product) {
        return reject("Produto não encontrado.");
      }
      resolve(product);
    });
  }
}

// Exemplo de uso com async/await:

const manager = new ProductManager();

(async () => {
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

    // Tentativa de adicionar um produto com código repetido
    const product3 = await manager.addProduct({
      title: "Produto 3",
      description: "Descrição do Produto 3",
      price: 150,
      thumbnail: "url_imagem_3",
      code: "ABC123", // Código repetido
      stock: 7,
    });
    console.log("Produto adicionado:", product3);
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
  }

  try {
    // Obtendo um produto pelo ID
    const product = await manager.getProductById(1);
    console.log("Produto encontrado:", product);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
  }

  try {
    // Tentativa de buscar um produto que não existe
    const product = await manager.getProductById(99);
    console.log("Produto encontrado:", product);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
  }
})();
