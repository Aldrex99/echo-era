import { NextFunction, Request, Response } from 'express'
import { IRequestUser, IUserForUser } from '../types/user.type'
import { validationResult } from "express-validator";
import { validationErrorsUtil } from "../utils/validationErrors.util";
import * as socialService from "../services/social.service";

// Search users by username
export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {query, limit} = req.query;

    // Get users
    const users: IUserForUser[] = await socialService.searchUser(query as string, parseInt(limit as string));

    return res.status(200).json({
      message: "Utilisateurs récupérés",
      users: users,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Get other user profile
export const getOtherProfile = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.params;

    // Get user
    const user: IUserForUser = await socialService.getOtherProfile(id);

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

// Get friends
export const getFriends = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    // Get friends
    const friends = await socialService.getFriends(req.user.id);

    return res.status(200).json({
      message: "Amis récupérés",
      friends: friends,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Add friend
export const addFriend = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.body;

    // Add friends
    await socialService.addFriend(req.user.id, id);

    return res.status(200).json({
      message: "Demande d'ami envoyée",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Get friends requests
export const getFriendRequests = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    // Get friends requests
    const requests = await socialService.getFriendRequests(req.user.id);

    return res.status(200).json({
      message: "Demandes d'amis récupérées",
      requests: requests,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Accept friend request
export const acceptFriendRequest = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.body;

    // Accept friend request
    await socialService.acceptFriendRequest(req.user.id, id);

    return res.status(200).json({
      message: "Demande d'ami acceptée",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Decline friend request
export const declineFriendRequest = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.body;

    // Decline friend request
    await socialService.declineFriendRequest(req.user.id, id);

    return res.status(200).json({
      message: "Demande d'ami refusée",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Cancel friend request
export const cancelFriendRequest = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.body;

    // Cancel friend request
    await socialService.cancelFriendRequest(req.user.id, id);

    return res.status(200).json({
      message: "Demande d'ami annulée",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Remove friends
export const removeFriend = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.body;

    // Remove friends
    await socialService.removeFriend(req.user.id, id);

    return res.status(200).json({
      message: "Ami supprimé",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Block user
export const blockUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.body;

    // Block user
    await socialService.blockUser(req.user.id, id);

    return res.status(200).json({
      message: "Utilisateur bloqué",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Unblock user
export const unblockUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.body;

    // Unblock user
    await socialService.unblockUser(req.user.id, id);

    return res.status(200).json({
      message: "Utilisateur débloqué",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Get blocked users
export const getBlockedUsers = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    // Get blocked users
    const blockedUsers = await socialService.getBlockedUsers(req.user.id);

    return res.status(200).json({
      message: "Utilisateurs bloqués récupérés",
      blockedUsers: blockedUsers,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Report user
export const reportUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id, messageId, reason} = req.body;

    // Report user
    await socialService.reportUser(req.user.id, id, messageId, reason);

    return res.status(200).json({
      message: "Utilisateur signalé",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}