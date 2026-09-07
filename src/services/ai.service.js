import { ai, GEMINI_MODEL } from "../config/gemini.config.js";

export const generateText = async (prompt) => {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });
  return response.text;
};

export const generateFromImage = async (prompt, file) => {
  const base64Image = file.buffer.toString("base64");
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
          mimeType: file.mimetype,
        },
      },
    ],
  });
  return response.text;
};

export const generateFromDocument = async (prompt, file) => {
  const base64Document = file.buffer.toString("base64");
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
          mimeType: file.mimetype,
        },
      },
    ],
  });
  return response.text;
};

export const generateFromAudio = async (prompt, file) => {
  const base64Audio = file.buffer.toString("base64");
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
          mimeType: file.mimetype,
        },
      },
    ],
  });
  return response.text;
};
