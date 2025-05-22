const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // or "gpt-4" if your account has access
      messages: messages,
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err.message || err);
    res.status(500).json({ error: "Failed to fetch response from OpenAI." });
  }
});

app.listen(PORT, () => {
  console.log(`🪨 Sisyphus rolling on port ${PORT}`);
});
