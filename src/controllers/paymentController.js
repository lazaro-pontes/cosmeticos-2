const { Payment, CardToken } = require('mercadopago');
const client = require('../config/mercadoPago');

const payment = new Payment(client);
const cardToken = new CardToken(client);

const createPixPayment = async (req, res) => {
  try {
    const { transaction_amount, description, paymentMethodId, email, identificationType, number } = req.body;

    // Validação dos campos obrigatórios
    if (!transaction_amount || !description || !paymentMethodId || !email || !identificationType || !number) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Calcula a data de expiração para 30 minutos a partir do momento atual
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 30);

    const paymentResponse = await payment.create({
      body: {
        transaction_amount,
        description,
        payment_method_id: paymentMethodId,
        payer: {
          email,
          identification: {
            type: identificationType,
            number,
          },
        },
        date_of_expiration: expirationDate.toISOString(),
      }
    });

    res.status(201).json(paymentResponse);
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).json({ error: error.message });
  }
};

const createCardPayment = async (req, res) => {
  try {
    const { transaction_amount, description, installments, paymentMethodId, payer, cardToken } = req.body;

    // Validação dos campos obrigatórios
    if (!transaction_amount || !description || !installments || !paymentMethodId || !payer || !cardToken) {
      return res.status(400)
        .json({
          error: "Todos os campos são obrigatórios.",
          campos: {
            transaction_amount,
            cardToken,
            description,
            installments,
            paymentMethodId,
            payer,
          }
        });
    }

    const paymentResponse = await payment.create({
      body: {
        transaction_amount,
        token: cardToken,
        description,
        installments,
        payment_method_id: paymentMethodId,
        payer: {
          email: payer.email,
          identification: {
            type: payer.identification.type,
            number: payer.identification.number,
          }
        }
      }
    });

    res.status(201).json(paymentResponse);
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).json({ error: error.message });
  }
};

// Gerar o token do cartão no backend para testes
const generateCardToken = async (req, res) => {
  try {
    const cardData = req.body; // Envie os dados do cartão via body

    // Chamada à API do Mercado Pago para gerar o card token
    const cardTokenResponse = await cardToken.create({
      card_number: cardData.card_number,
      expiration_month: cardData.expiration_month,
      expiration_year: cardData.expiration_year,
      security_code: cardData.security_code,
      cardholder: {
        name: cardData.cardholder_name,
        identification: cardData.cardholder_identification, // { type: "CPF", number: "12345678909" }
      },
    });

    res.status(201).json({ card_token: cardTokenResponse });
  } catch (error) {
    console.error("Erro ao gerar card token:", error.message);
    res.status(500).json({ message: "Erro ao gerar card token" });
  }
};

module.exports = { createPixPayment, createCardPayment, generateCardToken };