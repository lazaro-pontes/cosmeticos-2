const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

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

// Listar todos os usuários (para teste)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários.", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar usuário.", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        await user.remove();
        res.status(200).json({ message: "Usuário removido com sucesso." });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar usuário.", error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    updateUser,
    deleteUser,
};
