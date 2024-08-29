class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1; // ID inicial
  }

  addProduct(product) {
    // Validação: todos os campos são obrigatórios
    const { title, description, price, thumbnail, code, stock } = product;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos os campos são obrigatórios.");
      return;
    }

    // Validação: o campo 'code' não deve se repetir
    const codeExists = this.products.some((prod) => prod.code === code);
    if (codeExists) {
      console.error(`Produto com o código '${code}' já existe.`);
      return;
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
  }

  getProductById(id) {
    const product = this.products.find((prod) => prod.id === id);
    if (!product) {
      console.error("Produto não encontrado.");
      return;
    }
    return product;
  }
}

// Exemplo de uso:

const manager = new ProductManager();

// Adicionando produtos
manager.addProduct({
  title: "Produto 1",
  description: "Descrição do Produto 1",
  price: 100,
  thumbnail: "url_imagem_1",
  code: "ABC123",
  stock: 10,
});

manager.addProduct({
  title: "Produto 2",
  description: "Descrição do Produto 2",
  price: 200,
  thumbnail: "url_imagem_2",
  code: "DEF456",
  stock: 5,
});

// Tentativa de adicionar um produto com código repetido
manager.addProduct({
  title: "Produto 3",
  description: "Descrição do Produto 3",
  price: 150,
  thumbnail: "url_imagem_3",
  code: "ABC123", // Código repetido
  stock: 7,
});

// Obtendo um produto pelo ID
const product = manager.getProductById(1);
console.log(product); // Exibe o produto com ID 1

// Tentativa de buscar um produto que não existe
manager.getProductById(99); // Produto não encontrado
