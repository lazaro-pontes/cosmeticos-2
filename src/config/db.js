const { mongoUri } = require('./config');
const mongoose = require('mongoose');

// Função para conectar ao banco de dados
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB Atlas conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1); // Encerra o processo em caso de erro
  }
};

module.exports = connectDB;
