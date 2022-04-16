/* eslint-disable no-unused-vars */
import { logger } from "./logger";

export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

export class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    isOperational: boolean,
    description: string
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

// free to extend the BaseError
export class APIError extends BaseError {
  constructor(
    name: string,
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = "internal server error"
  ) {
    super(name, httpCode, isOperational, description);
  }
}

export class HTTP400Error extends BaseError {
  constructor(description = "bad request") {
    super("NOT FOUND", HttpStatusCode.BAD_REQUEST, true, description);
  }
}

class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    await logger.error("Central Error: ", err);
    // await sendMailToAdminIfCritical();
    // await sendEventsToSentry();
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}
export const errorHandler = new ErrorHandler();

// how to use this error
const user = "";
if (user === null)
  throw new APIError(
    "NOT FOUND",
    HttpStatusCode.NOT_FOUND,
    true,
    "detailed explanation"
  );

/**
 * For more info read the article:
 * https://www.toptal.com/nodejs/node-js-error-handling
 */
