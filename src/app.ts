/* Importing modules */
import express, { Application } from 'express';
import applyMiddlewares from "./middlewares/index.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { checkAccessToken } from "./middlewares/token.middleware";

/* Importing routes */
import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import socialRoute from "./routes/social.route";
import chatRoute from "./routes/chat.route";

/* Creating the application */
const app: Application = express();

/* Applying middlewares */
applyMiddlewares(app);

/* Importing routes */
app.use("/api/auth", authRoute);

app.use("/api/user", checkAccessToken, userRoute);

app.use("/api/social", checkAccessToken, socialRoute);

app.use("/api/chat", checkAccessToken, chatRoute);

/* Handling errors */
app.use(errorHandler);

/* Exporting the application */
export default app;