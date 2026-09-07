import { processChat } from "../services/chat.service.js";

export const handleChat = async (req, res, next) => {
  const { conversation, userProfile } = req.body;
  try {
    const result = await processChat(conversation, userProfile);
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};
