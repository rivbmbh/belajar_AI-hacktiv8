import * as aiService from "../services/ai.service.js";

export const handleGenerateText = async (req, res, next) => {
  const { prompt } = req.body;
  try {
    const result = await aiService.generateText(prompt);
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

export const handleGenerateFromImage = async (req, res, next) => {
  const { prompt } = req.body;
  try {
    const result = await aiService.generateFromImage(prompt, req.file);
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

export const handleGenerateFromDocument = async (req, res, next) => {
  const { prompt } = req.body;
  try {
    const result = await aiService.generateFromDocument(prompt, req.file);
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

export const handleGenerateFromAudio = async (req, res, next) => {
  const { prompt } = req.body;
  try {
    const result = await aiService.generateFromAudio(prompt, req.file);
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};
