/* Importing modules */
import express, { Application } from 'express';
import applyMiddlewares from "./middlewares/index.middleware";
import authRoute from "./routes/auth.route";

/* Creating the application */
const app: Application = express();

/* Applying middlewares */
applyMiddlewares(app);

/* Importing routes */
app.use("/api/auth", authRoute);

/* Exporting the application */
export default app;