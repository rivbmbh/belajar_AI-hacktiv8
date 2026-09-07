import { Router } from "express";
import aiRoutes from "./ai.routes.js";
import chatRoutes from "./chat.routes.js";

const router = Router();

// Mount routes
router.use("/", aiRoutes);
router.use("/api", chatRoutes);

export default router;
