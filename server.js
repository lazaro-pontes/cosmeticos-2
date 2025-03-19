const app = require('./src/app');
const connectDB = require('./src/config/db');
const { port, mongoUri } = require('./src/config/config');

// Inicia o banco e o servidor
const startServer = async () => {
  try {
    await connectDB(mongoUri);
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error.message);
    process.exit(1);
  }
};

startServer();