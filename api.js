// api.js
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const upload = multer({ dest: "uploads/" });

app.post("/submit", upload.single("paymentScreenshot"), async (req, res) => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  const { walletAddress, amount } = req.body;
  const file = req.file;

  let message = `💸 *New Submission Received!*\n\n` +
                `Wallet Address: ${walletAddress}\n` +
                `Amount: ${amount} USD`;

  try {
    // Send text message
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown"
    });

    // Send file if available
    if (file) {
      const form = new FormData();
      form.append("chat_id", TELEGRAM_CHAT_ID);
      form.append("document", fs.createReadStream(file.path));

      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, form, {
        headers: form.getHeaders(),
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send to Telegram" });
  }
});

export default app;
