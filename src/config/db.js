const mongoose = require('mongoose');

let isConnected = false; // Para evitar múltiplas conexões

const connectDB = async (uri) => {
  if (isConnected) {
    console.log("Já conectado ao MongoDB.");
    return;
  }

  if (!uri) {
    console.error("Erro: URI do MongoDB não fornecida.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;

    console.log(`Conectado ao banco de dados: ${uri}`);
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

