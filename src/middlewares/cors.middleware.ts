/**
 * middlewares/cors.ts - CORS middleware file
 * Handles CORS requests
 */

/* Imports */
import {Request, Response, NextFunction} from "express";

/* Middlewares */
export default {
  async handle(req : Request, res : Response, next : NextFunction) {
    const origin : string = req.headers.origin as string;
    const allowedOrigins : string[] = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:5174",
      ];
    if (allowedOrigins.indexOf(origin) > -1) {
      res.header(
        "Access-Control-Allow-Origin",
        origin
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.header(
        "Access-Control-Allow-Credentials",
        "true"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE"
      );
    }

    if (req.method === "OPTIONS") {
      return res.status(200).json({});
    }

    next();
  }
}