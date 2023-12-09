import { Router } from "express";
import * as userController from "../controllers/user.controller";
import * as userValidator from "../validators/user.validator";
import { checkAccessToken } from "../middlewares/token.middleware";

const router: Router = Router();

/* Routes */
// GET api/user/profile - Get user profile
router.get("/profile", checkAccessToken, userController.getProfile);

// PUT api/user/update - Update user
router.put("/update", checkAccessToken, userValidator.updateUser, userController.updateUser);

// DELETE api/user/delete - Delete user
router.delete("/delete", checkAccessToken, userController.deleteUser);

export default router;