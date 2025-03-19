// Importação das dependências
const express = require("express");
const morgan = require("morgan"); // Logger HTTP para desenvolvimento
const cors = require("cors"); // Para permitir requisições de outras origens
const userRoutes = require("./routes/userRoutes"); // Irotas de usuarios
const errorHandler = require("./middlewares/errorMiddleware"); // Middleware de tratamento de erros


// Inicialização do aplicativo Express
const app = express();

// Middlewares globais
app.use(express.json()); // Para processar JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Para processar dados codificados em URL
app.use(morgan('dev')); // Log de requisições no console
app.use(cors()); // Habilitar CORS

// rota de status para monitoramento
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Importar rotas
app.use("/api/users", userRoutes);

app.use(errorHandler); // Middleware de tratamento de erros

module.exports = app;
