import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import {
  handleGenerateText,
  handleGenerateFromImage,
  handleGenerateFromDocument,
  handleGenerateFromAudio,
} from "../controllers/ai.controller.js";

const router = Router();

router.post("/generate-text", handleGenerateText);
router.post("/generate-from-image", upload.single("image"), handleGenerateFromImage);
router.post("/generate-from-document", upload.single("document"), handleGenerateFromDocument);
router.post("/generate-from-audio", upload.single("audio"), handleGenerateFromAudio);

export default router;
