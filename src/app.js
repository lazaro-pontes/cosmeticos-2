// Importação das dependências
<<<<<<< Updated upstream
const express = require('express');
const morgan = require('morgan'); // Logger HTTP para desenvolvimento
const cors = require('cors'); // Para permitir requisições de outras origens
// const routes = require('./routes'); // Importação futura das rotas
=======
const express = require("express");
const morgan = require("morgan"); // Logger HTTP para desenvolvimento
const cors = require("cors"); // Para permitir requisições de outras origens
const userRoutes = require("./routes/userRoutes"); // Irotas de usuarios
const errorHandler = require("./middlewares/errorMiddleware"); // Middleware de tratamento de erros
>>>>>>> Stashed changes

// Inicialização do aplicativo Express
const app = express();

// Middlewares globais
app.use(express.json()); // Para processar JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Para processar dados codificados em URL
app.use(morgan('dev')); // Log de requisições no console
app.use(cors()); // Habilitar CORS
app.use(errorHandler); // Middleware de tratamento de erros

// Rota inicial (apenas para teste)
app.get('/', (req, res) => {
  res.send('Bem-vindo ao backend do e-commerce!');
});

// Importar rotas
<<<<<<< Updated upstream
// app.use('/api', routes); // Usará as rotas da pasta routes/
=======
app.use("/api/users", userRoutes); // Usará as rotas da pasta routes/
>>>>>>> Stashed changes

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

module.exports = app;
