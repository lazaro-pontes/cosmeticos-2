const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");
const validatePayment = require("../utils/validatePayment");

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, paymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Os itens do pedido são obrigatórios." });
    }

    if (!paymentId) {
      return res.status(400).json({ message: "O ID do pagamento é obrigatório." });
    }

    // Validar o pagamento no Mercado Pago
    const paymentDetails = await validatePayment(paymentId);

    let totalPrice = 0;
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product).session(session);
        if (!product) {
          throw new Error(`Produto com ID ${item.product} não encontrado.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto ${product.name}.`);
        }

        const subtotal = product.price * item.quantity;
        totalPrice += subtotal;

        product.stock -= item.quantity;
        await product.save({ session });

        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const order = await Order.create(
      [
        {
          user: req.user._id,
          items: populatedItems,
          totalPrice,
          paymentId,
          paymentStatus: paymentDetails.status, // Salvar o status do pagamento
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Pedido criado com sucesso!", order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Erro ao criar pedido:", error.message);
    res.status(500).json({ message: "Erro ao criar pedido.", error: error.message });
  }
};

// Listar todos os pedidos do usuário logado
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error.message);
    res.status(500).json({ message: "Erro ao buscar pedidos.", error: error.message });
  }
};

// Listar todos os pedidos (somente para admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("items.product").populate("user", "name email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Erro ao buscar todos os pedidos:", error.message);
    res.status(500).json({ message: "Erro ao buscar pedidos.", error: error.message });
  }
};

// Atualizar status do pedido (somente admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();

    res.status(200).json({ message: "Status do pedido atualizado com sucesso!", order: updatedOrder });
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error.message);
    res.status(500).json({ message: "Erro ao atualizar pedido.", error: error.message });
  }
};

// Deletar pedido (somente admin)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Pedido deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar pedido:", error.message);
    res.status(500).json({ message: "Erro ao deletar pedido.", error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};