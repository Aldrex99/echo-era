import { NextFunction, Response } from "express";
import { IRequestUser } from "../types/user.type";
import * as userService from "../services/user.service";
import * as formatUser from "../utils/formatUser.util";
import { validationResult } from "express-validator";

// Get profile of the user
export const getProfile = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    // Get user
    const user = await userService.getUserById(req.user.id);

    // Format user
    const formattedUser = formatUser.personalUser(user);

    return res.status(200).json({
      message: "Utilisateur récupéré",
      user: formattedUser,
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
  if (!errors.isEmpty()) {
    return res.status(422).json({
      code: 422,
      message: "Les données envoyées sont incorrectes",
      errors: errors.array(),
    });
  }
  
  try {
    // Get user
    const user = await userService.getUserById(req.user.id);

    // Update user
    const updatedUser = await userService.updateUser(user, req.body);

    // Format user
    const formattedUser = formatUser.personalUser(updatedUser);

    return res.status(200).json({
      message: "Utilisateur mis à jour",
      user: formattedUser,
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