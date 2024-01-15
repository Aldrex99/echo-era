import { NextFunction, Response } from 'express'
import { IRequestUser } from '../types/user.type'
import { validationResult } from "express-validator";
import { validationErrorsUtil } from "../utils/validationErrors.util";
import * as socialService from "../services/social.service";

// Search users by username
export const searchUsers = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {search, limit} = req.query;

    // Get users
    const users = await socialService.searchUser(search as string, parseInt(limit as string), req.user.id);

    return res.status(200).json({
      message: "Utilisateurs récupérés",
      users: users.users,
      total: users.total,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Get other user profile
export const getOtherProfile = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {otherUserId} = req.params;

    // Get user
    const user = await socialService.getOtherProfile(otherUserId, req.user.id);

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
    const {receiverId} = req.params;

    // Add friends
    await socialService.addFriend(req.user.id, receiverId);

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
    const {requestId} = req.params;

    // Accept friend request
    await socialService.acceptFriendRequest(req.user.id, requestId);

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
    const {requestId} = req.params;

    // Decline friend request
    await socialService.declineFriendRequest(req.user.id, requestId);

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
    const {requestId} = req.params;

    // Cancel friend request
    await socialService.cancelFriendRequest(req.user.id, requestId);

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
    const {friendId} = req.params;

    // Remove friends
    await socialService.removeFriend(req.user.id, friendId);

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
    const {otherUserId} = req.params;

    // Block user
    await socialService.blockUser(req.user.id, otherUserId);

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
    const {blockedId} = req.params;

    // Unblock user
    await socialService.unblockUser(req.user.id, blockedId);

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

// Block chat
export const blockChat = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const {chatId} = req.params;

    // Block chat
    await socialService.blockChat(req.user.id, chatId);

    return res.status(200).json({
      message: "Chat bloqué",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Unblock chat
export const unblockChat = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const {chatId} = req.params;

    // Unblock chat
    await socialService.unblockChat(req.user.id, chatId);

    return res.status(200).json({
      message: "Chat débloqué",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Get blocked chats
export const getBlockedChats = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    // Get blocked chats
    const blockedChats = await socialService.getBlockedChats(req.user.id);

    return res.status(200).json({
      message: "Chats bloqués récupérés",
      blockedChats: blockedChats,
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
    const {otherUserId} = req.params;
    const {reasonId, comment} = req.body;

    // Report user
    await socialService.reportUser(req.user.id, otherUserId, reasonId, comment);

    return res.status(200).json({
      message: "Utilisateur signalé",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}