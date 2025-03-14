const express = require("express");
const { registerUser, loginUser, getUsers, updateUserRole  } = require("../controllers/userController");
const router = express.Router();

// Registrar usuário
router.post("/register", registerUser);

// Login de usuário
router.post("/login", loginUser);

// Listar usuários (exemplo)
router.get("/", getUsers);

// Atualiza permissão do usuario
router.put("/updateRole", updateUserRole);

module.exports = router;
