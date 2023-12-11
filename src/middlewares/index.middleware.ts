import logger from "morgan";
import express, { Application } from "express";
import cors from "./cors.middleware";

const middlewares = [
  logger("dev"), // Logs requests to the console
  express.json(), // Parses JSON requests
  express.urlencoded({extended: false}), // Parses URL encoded requests
  cors.handle, // Handles CORS requests
]

export default function (app: Application) {
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
}