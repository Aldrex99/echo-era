import { NextFunction, Response } from "express";
import { IRequestUser } from "../types/user.type";
import * as userService from "../services/user.service";
import { validationResult } from "express-validator";
import { validationErrorsUtil } from "../utils/validationErrors.util";

// Get profile of the user
export const getProfile = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    // Get user
    const user = await userService.getProfile(req.user.id);

    return res.status(200).json({
      message: "Utilisateur récupéré",
      user: user,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Update user
export const updateUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    // Update user
    const updatedUser = await userService.updateUser(req.user.id, req.body);

    return res.status(200).json({
      message: "Utilisateur mis à jour",
      user: updatedUser,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Delete user
export const deleteUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    // Delete user
    await userService.deleteUser(req.user.id);

    return res.status(200).json({
      message: "Utilisateur supprimé",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}