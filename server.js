const app = require("./src/app");
const connectDB = require("./src/config/db"); // Importa a conexão com MongoDB
const { port } = require("./src/config/config");

// Conectar ao banco de dados
connectDB();

// Definir a porta do servidor
const PORT = port || 3000;

// Inicializar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
