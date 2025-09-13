const { v4: uuidv4 } = require("uuid");
const sessions = {};
const menu = require("./data/menu.json");

function initSession(sessionId) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = { currentOrder: [], orderHistory: [] };
  }
}

function getResponse(sessionId, input) {
  initSession(sessionId);
  const session = sessions[sessionId];
  let reply = "";

  switch (input) {
    case "1":
      reply = "Menu:\n" + menu.map((item, i) => `${i + 1}. ${item}`).join("\n");
      break;
    case "99":
      if (session.currentOrder.length) {
        session.orderHistory.push([...session.currentOrder]);
        session.currentOrder = [];
        reply = "✅ Order placed! Use '1' to place a new order.";
      } else {
        reply = "⚠️ No order to place. Select '1' to order.";
      }
      break;
    case "98":
      reply = session.orderHistory.length
        ? "📜 Order History:\n" + JSON.stringify(session.orderHistory)
        : "No past orders.";
      break;
    case "97":
      reply = session.currentOrder.length
        ? "🛒 Current Order:\n" + session.currentOrder.join(", ")
        : "No active order.";
      break;
    case "0":
      session.currentOrder = [];
      reply = "❌ Current order canceled.";
      break;
    default:
      if (Number(input) && menu[Number(input) - 1]) {
        const item = menu[Number(input) - 1];
        session.currentOrder.push(item);
        reply = `${item} added to your order. Select 99 to checkout.`;
      } else {
        reply = `Options:
1. Place an order
99. Checkout
98. Order history
97. Current order
0. Cancel order`;
      }
  }
  return { reply, sessionId };
}

module.exports = { getResponse };
