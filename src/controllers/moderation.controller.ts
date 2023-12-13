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

// Warn user
export const warnUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.params;
    const {reason} = req.body;

    await moderationService.warnUser(id, reason, req.user.id);

    return res.status(200).json({
      message: "Utilisateur averti",
    });
  } catch (err) {
    next(err);
  }
}

// unWarn user
export const unWarnUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id, warnId} = req.params;

    const {reason} = req.body;

    await moderationService.unWarnUser(id, warnId, reason, req.user.id);

    return res.status(200).json({
      message: "Avertissement supprimé",
    });
  } catch (err) {
    next(err);
  }

}

// Mute user
export const muteUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.params;
    const {reason, durationInMin} = req.body;

    await moderationService.muteUser(id, reason, durationInMin, req.user.id);

    return res.status(200).json({
      message: "Utilisateur muté",
    });
  } catch (err) {
    next(err);
  }
}

// Unmute user
export const unMuteUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const {reason} = req.body;

    await moderationService.unMuteUser(id, req.user.id, reason);

    return res.status(200).json({
      message: "Utilisateur démuté",
    });
  } catch (err) {
    next(err);
  }
}

// Ban user
export const banUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const {reason, durationInHours} = req.body;

    await moderationService.banUser(id, reason, durationInHours, req.user.id);

    return res.status(200).json({
      message: "Utilisateur banni",
    });
  } catch (err) {
    next(err);
  }
}

// Unban user
export const unBanUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const {reason} = req.body;

    await moderationService.unBanUser(id, req.user.id, reason);

    return res.status(200).json({
      message: "Utilisateur débanni",
    });
  } catch (err) {
    next(err);
  }
}

// Get all users are warnings
export const getAllUsersAreWarnings = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const users = await moderationService.getAllUsersAreWarnings();

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

// Get all users are muted
export const getAllUsersAreMuted = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const users = await moderationService.getAllUsersAreMuted();

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

// Get all users are banned
export const getAllUsersAreBanned = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const users = await moderationService.getAllUsersAreBanned();

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

// Get reports

// Search reports

// Get report by id

// Change report status

// Get reported message

// Search reported messages

// Delete reported message