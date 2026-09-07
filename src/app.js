import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Serve Static Frontend Files from public/
app.use(express.static(path.join(__dirname, "../public")));

// Register API Routes
app.use("/", routes);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
