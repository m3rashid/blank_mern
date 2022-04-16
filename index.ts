import { config } from "dotenv";
config();
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

import routes from "./routes";
import { logger } from "./utils/logger";
import { isDevEnvironment } from "./utils/helpers";
import { errorHandler } from "./utils/errors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (isDevEnvironment()) {
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
    if (isDevEnvironment()) {
      await mongoose.connect("mongodb://localhost/test");
    } else {
      await mongoose.connect("mongodb://localhost/test");
    }
    logger.info("Mongoose is connected");
  } catch (err) {
    logger.error(JSON.stringify(err));
    logger.error("MongoDB connection error");
    process.exit(1);
  }
  logger.info(`Server ready on: http://localhost:${port}`);
});
