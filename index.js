import "dotenv/config";
import express from "express";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = "gemini-3.5-flash-lite";

app.use(express.json());

app.post("/generate-text", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    res.status(200).json({ result: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  const { prompt } = req.body;
  const base64Image = req.file.buffer.toString("base64");
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text: prompt,
          type: "text",
        },
        {
          inlineData: {
            data: base64Image,
            mimeType: req.file.mimetype,
          },
        },
      ],
    });
    res.status(200).json({ result: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.post(
  "/generate-from-document",
  upload.single("document"),
  async (req, res) => {
    const { prompt } = req.body;
    const base64Document = req.file.buffer.toString("base64");
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            text: prompt ?? "Tolong buatkan ringkasan dari dokumen ini",
            type: "text",
          },
          {
            inlineData: {
              data: base64Document,
              mimeType: req.file.mimetype,
            },
          },
        ],
      });
      res.status(200).json({ result: response.text });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
);

app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
  const { prompt } = req.body;
  const base64Audio = req.file.buffer.toString("base64");
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text: prompt ?? "Tolong buatkan ringkasan dari audio ini",
          type: "text",
        },
        {
          inlineData: {
            data: base64Audio,
            mimeType: req.file.mimetype,
          },
        },
      ],
    });
    res.status(200).json({ result: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));
