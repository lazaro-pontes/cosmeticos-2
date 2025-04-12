const { Payment } = require('mercadopago');
const Order = require("../models/Order");
const client = require('../config/mercadoPago');

const payment = new Payment(client);

const processWebhook = async (req, res) => {
  try {
    const { id, topic } = req.query;

    if (topic === "payment") {
      // Buscar os detalhes do pagamento no Mercado Pago
      const paymentResponse = await payment.get();

      if (!paymentResponse) {
        return res.status(404).json({ message: "Pagamento não encontrado." });
      }

      const paymentStatus = paymentResponse.status;

      // Atualizar o status do pedido com base no paymentId
      const order = await Order.findOne({ paymentId: id });
      if (order) {
        order.paymentStatus = paymentStatus;
        await order.save();
        console.log(`Pedido ${order._id} atualizado para status: ${paymentStatus}`);
      } else {
        console.warn(`Nenhum pedido encontrado para o paymentId: ${id}`);
      }

      res.status(200).json({ message: "Webhook processado com sucesso." });
    } else {
      res.status(400).json({ message: "Webhook inválido." });
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error.message);
    res.status(500).json({ message: "Erro ao processar webhook.", error: error.message });
  }
};

module.exports = { processWebhook };