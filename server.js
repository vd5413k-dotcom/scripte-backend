const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.ANTHROPIC_API_KEY;

app.post("/api/generate", async (req, res) => {
try {
const { messages, system } = req.body;
const response = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: {
"Content-Type": "application/json",
"x-api-key": API_KEY,
"anthropic-version": "2023-06-01",
},
body: JSON.stringify({
model: "claude-haiku-4-5-20251001",
max_tokens: 1000,
system,
messages,
}),
});
const data = await response.json();
res.json(data);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

app.listen(4000, () => console.log("Serveur lancé sur le port 4000"));