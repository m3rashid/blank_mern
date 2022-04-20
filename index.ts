import { config } from "dotenv";
config();
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";

import routes from "./routes";
import { logger } from "./utils/logger";
import { isDevEnvironment } from "./utils/helpers";
import { errorHandler } from "./utils/errors";

const app = express();
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let mongoUri = "mongodb://localhost/test"; // put production uri here
if (isDevEnvironment()) {
  mongoUri = "mongodb://localhost/test";
  mongoose.set("debug", true);
}

app.use(routes);

// Global error handler
app.use((err: any, req: Request, res: Response, _: NextFunction) => {
  errorHandler.handleError(err);
  return res.status(500).json({
    message: isDevEnvironment()
      ? JSON.stringify(err.message) || "Internal Server Error"
      : "Internal Server Error",
  });
});

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  try {
    await mongoose.connect(mongoUri);
    logger.info("Mongoose is connected");
  } catch (err) {
    logger.error(JSON.stringify(err));
    logger.error("MongoDB connection error");
    process.exit(1);
  }
  logger.info(`Server ready on: http://localhost:${port}`);
});
