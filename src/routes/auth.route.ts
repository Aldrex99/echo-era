import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import * as authValidator from "../validators/auth.validator";
import { checkRefreshToken } from "../middlewares/token.middleware";

const router: Router = Router();

/* Routes */
// POST api/auth/register - Create a user
router.post("/register", authValidator.register, authController.register);

// POST api/auth/verify-email - Verify email
router.post("/verify-email", authValidator.verifyEmail, authController.verifyEmail);

// POST api/auth/login - Login
router.post("/login", authValidator.login, authController.login);

// GET api/auth/logout - Logout
router.get("/logout", checkRefreshToken, authController.logout);

// POST api/auth/forgot-password - Forgot password
router.post("/forgot-password", authValidator.forgotPassword, authController.forgotPassword);

// POST api/auth/reset-password - Reset password
router.post("/reset-password", authValidator.resetPassword, authController.resetPassword);

export default router;