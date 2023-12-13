import User from "../models/User.model";
import ModerationLog from "../models/ModerationLog.model";
import { AppError } from "../utils/error.util";

export const getAllUsers = async () => {
  return User.find();
}

export const getUserById = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  return user;
}

export const warnUser = async (userId: string, reason: string, warnerId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  // Create moderation log
  const newModerationLog = new ModerationLog({
    moderator: warnerId,
    affectedUser: userId,
    action: "warn",
    reason,
  });

  // Save moderation log
  newModerationLog.save().then((moderationLog) => {
    return moderationLog;
  }).catch((error) => {
    throw error;
  });

  // Warn user
  user.warnings.push({
    by: warnerId,
    reason,
    date: new Date(),
  });

  return user.save();
}

export const unWarnUser = async (userId: string, warnId: string, reason: string, moderatorId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  // Check if warn exists
  const warn = user.warnings.find(warn => warn._id.toString() === warnId);

  if (!warn) {
    throw new AppError("Avertissement introuvable", 404);
  }

  // Remove warn
  await User.findOneAndUpdate({_id: userId}, {$pull: {warnings: {_id: warnId}}});

  // Create moderation log
  const newModerationLog = new ModerationLog({
    moderator: moderatorId,
    affectedUser: userId,
    action: "unwarn",
    reason: reason ? reason : warn.reason,
  });

  // Save moderation log
  newModerationLog.save().then((moderationLog) => {
    return moderationLog;
  }).catch((error) => {
    throw error;
  });
}