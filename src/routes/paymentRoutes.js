const express = require("express");
const { createPixPayment, createCardPayment, generateCardToken } = require("../controllers/paymentController");
const router = express.Router();

// Endpoint para criar pagamento via Pix
router.post("/pix", createPixPayment);
router.post("/card", createCardPayment);
router.post("/generate-card-token", generateCardToken);

module.exports = router;
