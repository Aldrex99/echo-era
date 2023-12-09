/* Importing modules */
import express, { Application } from 'express';
import applyMiddlewares from "./middlewares/index.middleware";

/* Importing routes */
import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import socialRoute from "./routes/social.route";
import { checkAccessToken } from "./middlewares/token.middleware";

/* Creating the application */
const app: Application = express();

/* Applying middlewares */
applyMiddlewares(app);

/* Importing routes */
app.use("/api/auth", authRoute);

app.use("/api/user", checkAccessToken, userRoute);

app.use("/api/social", checkAccessToken, socialRoute);

/* Exporting the application */
export default app;