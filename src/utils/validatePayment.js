const { Payment } = require("mercadopago");
const client = require("../config/mercadoPago");

const payment = new Payment(client);

const validatePayment = async (paymentId) => {
  try {
    const paymentResponse = await payment.get(paymentId, client.options);

    // Verificar se o pagamento foi aprovado
    if (paymentResponse.response.status !== "approved") {
      throw new Error("Pagamento não aprovado.");
    }

    return paymentResponse.response; // Retorna os detalhes do pagamento
  } catch (error) {
    console.error("Erro ao validar pagamento:", error.message);
    throw new Error("Erro ao validar pagamento.");
  }
};

module.exports = validatePayment;