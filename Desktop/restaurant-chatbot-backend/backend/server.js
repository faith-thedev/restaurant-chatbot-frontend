const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// simple test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Chat route
app.post("/chat", (req, res) => {
  console.log("Received from frontend:", req.body);
  res.json({ reply: "Hello from backend!" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Chatbot backend running on http://localhost:${PORT}`);
});
