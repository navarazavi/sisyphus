require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const messages = req.body.messages;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo" if you prefer
      messages,
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err.response ? err.response.data : err.message);
    res.status(500).json({ reply: "Something broke in the Underworld. Try again later." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🪨 Sisyphus rolling on port ${PORT}`);
});
