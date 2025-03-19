const mongoose = require("mongoose");
const User = require("../models/User");

// Listar todos os usuários (para teste)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários.", error: error.message });
    }
};

// Atualizar usuário
const updateUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "ID inválido." });
        }

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
        console.error("Erro ao atualizar usuário:", error.message);
        res.status(500).json({ message: "Erro ao atualizar usuário.", error: error.message });
    }
};

// Deletar usuário
const deleteUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        await User.findByIdAndDelete(user._id);
        res.status(200).json({ message: "Usuário removido com sucesso." });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar usuário.", error: error.message });
        console.error("Erro ao deletar usuário:", error.message);
    }
};

module.exports = {
    getUsers,
    updateUser,
    deleteUser,
};
