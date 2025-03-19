const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { registerUser, loginUser } = require("../controllers/authController");
const { getUsers, updateUser, deleteUser } = require("../controllers/userController");


// Registrar usuário
router.post("/register", registerUser);

// Login de usuário
router.post("/login", loginUser);

// Listar usuários (exemplo)
router.get("/", protect, adminOnly, getUsers);

// Atualizar usuário
router.put("/:id", protect, adminOnly, updateUser);

// Deletar usuário
router.delete("/:id", protect, adminOnly, deleteUser);


module.exports = router;
