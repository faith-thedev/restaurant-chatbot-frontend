const axios = require("axios");

const PAYSTACK_SECRET = "sk_test_xxxxx"; // replace with your test key

async function initPayment(email, amount) {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      { email, amount: amount * 100 }, // amount in kobo
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );
    return response.data;
  } catch (err) {
    return { error: err.message };
  }
}

async function verifyPayment(reference) {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );
    return response.data;
  } catch (err) {
    return { error: err.message };
  }
}

module.exports = { initPayment, verifyPayment };
