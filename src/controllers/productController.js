const Product = require("../models/Product");

// Criar um novo produto
const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, description, images } = req.body;

    if (!name || !price || !stock || !category) {
      return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    const product = await Product.create({ name, price, stock, category, description, images });
    res.status(201).json({ message: "Produto criado com sucesso!", product });
  } catch (error) {
    console.error("Erro ao criar produto:", error.message);
    res.status(500).json({ message: "Erro ao criar produto.", error: error.message });
  }
};

// Obter todos os produtos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.message);
    res.status(500).json({ message: "Erro ao buscar produtos.", error: error.message });
  }
};

// Obter um produto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao buscar produto:", error.message);
    res.status(500).json({ message: "Erro ao buscar produto.", error: error.message });
  }
};

// Atualizar um produto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category, description, images } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.description = description || product.description;
    product.images = images || product.images;

    const updatedProduct = await product.save();
    res.status(200).json({ message: "Produto atualizado com sucesso!", product: updatedProduct });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error.message);
    res.status(500).json({ message: "Erro ao atualizar produto.", error: error.message });
  }
};

// Deletar um produto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Produto removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar produto:", error.message);
    res.status(500).json({ message: "Erro ao deletar produto.", error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};