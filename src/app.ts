/* Importing modules */
import express, { Application } from 'express';
import applyMiddlewares from "./middlewares/index.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { checkAccessToken } from "./middlewares/token.middleware";
import checkUserRole from "./middlewares/role.middleware";

/* Importing routes */
import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import socialRoute from "./routes/social.route";
import chatRoute from "./routes/chat.route";
import messageRoute from "./routes/message.route";
import moderationRoute from "./routes/moderation.route";

/* Creating the application */
const app: Application = express();

/* Applying middlewares */
applyMiddlewares(app);

/* Importing routes */
app.use("/api/auth", authRoute);

app.use("/api/user", checkAccessToken, checkUserRole(['user', 'moderator', 'admin']), userRoute);

app.use("/api/social", checkAccessToken, checkUserRole(['user', 'moderator', 'admin']), socialRoute);

app.use("/api/chat", checkAccessToken, checkUserRole(['user', 'moderator', 'admin']), chatRoute);

app.use("/api/message", checkAccessToken, checkUserRole(['user', 'moderator', 'admin']), messageRoute);

app.use("/api/moderation", checkAccessToken, checkUserRole(['moderator', 'admin']), moderationRoute);

/* Handling errors */
app.use(errorHandler);

/* Exporting the application */
export default app;