import { Response, NextFunction } from "express";
import { IRequestUser } from "../types/user.type";
import * as moderationService from '../services/moderation.service';
import { getUsersByMultipleFields } from "../services/user.service";
import { ISearchFields } from "../types/global.type";
import { userForModeration } from "../utils/formatUser.util";
import { validationResult } from "express-validator";
import { validationErrorsUtil } from "../utils/validationErrors.util";

// Get all users
export const getAllUsers = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const users = await moderationService.getAllUsers();

    const formattedUsers = users.map((user) => {
      return userForModeration(user);
    });

    return res.status(200).json({
      message: "Utilisateurs récupérés",
      users: formattedUsers,
    });
  } catch (err) {
    next(err);
  }
}

// Search users by usernames, previousNames, emails, previousEmails, usernameOnDelete, emailOnDelete
export const searchUsers = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {query, limit, offset} = req.query;
    const fields: ISearchFields[] = [
      {field: 'username'},
      {field: {field: 'previousNames', elemMatch: 'username'}},
      {field: 'email'},
      {field: {field: 'previousEmails', elemMatch: 'email'}},
      {field: 'usernameOnDelete'},
      {field: 'emailOnDelete'},
    ];


    const users = await getUsersByMultipleFields(fields, query as string, parseInt(offset as string), parseInt(limit as string));

    const formattedUsers = users.result.map((user) => {
      return userForModeration(user);
    });

    return res.status(200).json({
      message: "Utilisateurs récupérés",
      users: formattedUsers,
    });
  } catch (err) {
    next(err);
  }
}

// Get user by id
export const getUserById = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.params;

    const user = await moderationService.getUserById(id);

    const formattedUser = userForModeration(user);

    return res.status(200).json({
      message: "Utilisateur récupéré",
      user: formattedUser,
    });
  } catch (err) {
    next(err);
  }
}

// Get other user profile

// Warn user

// Mute user

// Ban user

// Get user warnings

// Get user mutes

// Get user bans

// Get user sanctions

// Get reports

// Search reports

// Get report by id

// Change report status

// Get reported message

// Search reported messages

// Delete reported message