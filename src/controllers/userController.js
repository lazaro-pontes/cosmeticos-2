const bcrypt = require("bcrypt");
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
        res.status(500).json({ message: "Erro ao registrar usuário.", error: error.message });
    }
};

// Login de usuário
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica se o usuário existe
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        res.status(200).json({ message: "Login realizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao realizar login.", error: error.message });
    }
};

// Listar todos os usuários (para teste)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários.", error: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id, isAdmin } = req.body;

        // Verifica se o usuário autenticado tem permissão para alterar permissões
        if (!req.user?.isAdmin) {
            return res.status(403).json({ message: "Acesso negado. Somente administradores podem alterar permissões." });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        user.isAdmin = isAdmin;
        await user.save();

        res.status(200).json({ message: "Permissão do usuário atualizada com sucesso.", user });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar permissões.", error: error.message });
    }
};


module.exports = { registerUser, loginUser, getUsers, updateUserRole };
