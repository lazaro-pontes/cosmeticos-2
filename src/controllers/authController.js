const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const User = require("../models/User");

// Registrar usuário
const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Verifica se o e-mail já está registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Usuário já registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    if (req.user?.isAdmin && isAdmin !== undefined) {
      newUser.isAdmin = isAdmin;
    }

    // Cria o novo usuário
    const user = await User.create(newUser);
    res.status(201).json({
      message: "Usuário registrado com sucesso!",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.message); // Log detalhado
    res.status(500).json({ message: "Erro ao registrar o usuário." });
  }
};

// Login de usuário
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = generateToken(user._id, user.isAdmin);

    res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(500).json({
      message: "Erro ao realizar login.",
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};