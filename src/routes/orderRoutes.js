const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderControllers");

// Criar pedido
router.post("/", protect, createOrder);

// Listar pedidos do usuário logado
router.get("/", protect, getUserOrders);

// Listar todos os pedidos (admin)
router.get("/all", protect, adminOnly, getAllOrders);

// Atualizar status do pedido (admin)
router.put("/:id", protect, adminOnly, updateOrderStatus);

// Deletar pedido (admin)
router.delete("/:id", protect, adminOnly, deleteOrder);

module.exports = router;