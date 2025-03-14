const mongoose = require('mongoose');

// Definição do Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

// Criação do modelo
const User = mongoose.model('User', userSchema);

module.exports = User;
