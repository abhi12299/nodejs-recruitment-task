import { NextFunction, Request, Response } from "express";
import log from "loglevel";
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { Service } from "typedi";
import { APIError } from "../utils/errors";

@Service()
@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, _next: NextFunction) {
    log.error(`error:`, JSON.stringify(error, null, 2));
    log.error(`body:`, JSON.stringify(request.body, null, 2));
    if (error instanceof APIError) {
      return response.status(error.statusCode).json({
        error: error.message,
      });
    }
    if (error.name === "TokenExpiredError") {
      return response.status(400).json({
        error: error.message,
      });
    }
    // validation error
    if (error.errors) {
      return response.status(400).json({
        error: "Invalid payload",
      });
    }
    if (error.httpCode) {
      return response.status(error.httpCode).json(error.message);
    }
    return response.status(500).json("something went wrong");
  }
}
