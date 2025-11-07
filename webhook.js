import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

app.post("/", async (req, res) => {
  try {
    const message = req.body.message;
    if (!message || !message.text) {
      return res.send("ok");
    }

    const chatId = message.chat.id;
    const text = message.text;

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: `You said: ${text}`
    });

    res.send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

export default app;
