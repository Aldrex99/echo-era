import { Response, NextFunction } from "express";
import { IRequestUser } from "../types/user.type";
import * as moderationService from '../services/moderation.service';

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

// Get user by id

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