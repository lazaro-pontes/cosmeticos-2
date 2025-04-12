const { MercadoPagoConfig } = require('mercadopago');
const { mercadoPagoAccessToken } = require('./config');

const client = new MercadoPagoConfig({ accessToken: mercadoPagoAccessToken, options: { timeout: 5000 } });


console.log("Access Token configurado:", client); // Confirmação do token

module.exports = client;
